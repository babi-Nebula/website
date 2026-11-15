from __future__ import annotations

import base64
import hashlib
import hmac
import json
import math
import os
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, Depends, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from dotenv import load_dotenv
from sqlalchemy import DateTime, Float, ForeignKey, JSON, LargeBinary, String, Text, create_engine, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker


ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")
IS_VERCEL = bool(os.getenv("VERCEL"))
DATABASE_CONFIGURED = not IS_VERCEL or bool(os.getenv("DATABASE_URL"))
DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./enqu-made.db"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif DATABASE_URL.startswith("postgresql://") and "+psycopg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
IS_SQLITE = DATABASE_URL.startswith("sqlite")
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=1 if not IS_SQLITE else 5,
    max_overflow=0 if not IS_SQLITE else 10,
    connect_args={"check_same_thread": False} if IS_SQLITE else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Seller(Base):
    __tablename__ = "sellers"
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    contact_name: Mapped[str] = mapped_column(String(100))
    business_name: Mapped[str] = mapped_column(String(120), index=True)
    email: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    phone: Mapped[str] = mapped_column(String(40), default="")
    country: Mapped[str] = mapped_column(String(80))
    location: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    product_name: Mapped[str] = mapped_column(String(120))
    product_category: Mapped[str] = mapped_column(String(80))
    product_price: Mapped[float] = mapped_column(Float)
    product_image_name: Mapped[str] = mapped_column(String(240), default="")
    product_image_type: Mapped[str] = mapped_column(String(80), default="")
    product_image_data: Mapped[bytes | None] = mapped_column(LargeBinary, nullable=True)
    status: Mapped[str] = mapped_column(String(24), default="Pending", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Product(Base):
    __tablename__ = "products"
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    maker: Mapped[str] = mapped_column(String(120))
    seller: Mapped[str] = mapped_column(String(120), default="")
    category: Mapped[str] = mapped_column(String(80), index=True)
    price: Mapped[float] = mapped_column(Float)
    image: Mapped[str] = mapped_column(Text, default="")
    image_type: Mapped[str] = mapped_column(String(80), default="")
    image_data: Mapped[bytes | None] = mapped_column(LargeBinary, nullable=True)
    alt: Mapped[str] = mapped_column(String(240), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    label: Mapped[str] = mapped_column(String(80), default="Handmade")
    status: Mapped[str] = mapped_column(String(24), default="active", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Order(Base):
    __tablename__ = "orders"
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    customer: Mapped[dict[str, Any]] = mapped_column(JSON().with_variant(JSONB(), "postgresql"))
    items: Mapped[list[dict[str, Any]]] = mapped_column(JSON().with_variant(JSONB(), "postgresql"))
    total: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(12), default="ETB")
    payment_method: Mapped[str] = mapped_column(String(80), default="")
    status: Mapped[str] = mapped_column(String(24), default="New", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class AdminSession(Base):
    __tablename__ = "admin_sessions"
    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class CustomerSession(Base):
    __tablename__ = "customer_sessions"
    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    customer_id: Mapped[str] = mapped_column(ForeignKey("customers.id", ondelete="CASCADE"), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class Setting(Base):
    __tablename__ = "settings"
    key: Mapped[str] = mapped_column(String(80), primary_key=True)
    value: Mapped[str] = mapped_column(Text)


DEFAULT_PRODUCTS = [
    ("jebena", "Traditional clay jebena", "Coffee & pottery", 1800, "Asset/Authentic%20Tigray%20Red%20Clay%20Jebena%20-%20Spoutless%20Ethiopian%20Coffee%20Pot%2C%20Handcrafted%20Habesha%20Pitcher.jpg", "A terracotta coffee pot inspired by the Ethiopian coffee ceremony.", "Coffee ritual"),
    ("woven-tray", "Colorful woven tray", "Home & basketry", 950, "Asset/downnload.jpg", "A vibrant woven accent for serving or displaying at home.", "Handwoven"),
    ("hand-cross", "Ethiopian hand cross", "Art & heritage", 2200, "Asset/Ethiopian%20Hand%20Cross.jpg", "An ornamental cross with traditional openwork and detailed design.", "Heritage"),
    ("djembe", "Hand-carved djembe", "Music & culture", 3400, "Asset/Djembe%20stock.jpg", "A striking carved drum inspired by East African musical traditions.", "Music"),
    ("wooden-spoon", "Carved serving spoon", "Art & heritage", 680, "Asset/%28%23144%29%20Quatre%20cuillers%2C%20Boni%2C%20Somalie.jpg", "A carved wooden spoon with engraved details and a sculpted handle.", "Carved by hand"),
    ("coffee-mortar", "Coffee ceremony mortar", "Coffee & pottery", 1250, "Asset/download11.jpg", "A wooden mortar and pestle for preparing coffee and spices.", "Coffee ritual"),
    ("headrest", "Carved wooden headrest", "Art & heritage", 2600, "Asset/Boni%20Headrest%203%2C%20Somalia.jpg", "A sculptural piece highlighting the artistry of carved wood.", "Artisan craft"),
    ("woven-plate", "Natural woven plate", "Home & basketry", 1100, "Asset/%D8%A7%D8%B7%D9%84%D8%B9%20%D8%B9%D9%84%D9%89%20%D9%87%D8%B0%D8%A7%20%D8%A7%D9%84%D9%85%D9%86%D8%B4%D9%88%D8%B1%20%D9%85%D9%86%20Htj.jpg", "A handwoven plate with warm natural fibers and a geometric border.", "Handwoven"),
]


def init_database() -> None:
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        if db.get(Setting, "catalogSeeded") is None:
            if db.scalar(select(Product.id).limit(1)) is None:
                for product_id, name, category, price, image, description, label in DEFAULT_PRODUCTS:
                    db.add(Product(id=product_id, name=name, maker=category, seller=category, category=category, price=price, image=image, alt=name, description=description, label=label, status="active"))
            db.add(Setting(key="catalogSeeded", value="true"))
        if db.get(Setting, "commissionRate") is None:
            db.add(Setting(key="commissionRate", value="10"))
        if db.get(Setting, "marketingSpend") is None:
            db.add(Setting(key="marketingSpend", value="0"))
        db.commit()


if DATABASE_CONFIGURED:
    init_database()
app = FastAPI(title="ENQU MADE API", version="1.0.0", docs_url="/api/docs", redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["null"],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)
MAX_IMAGE_BYTES = 5 * 1024 * 1024
IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ORDER_STATUSES = {"New", "Processing", "Completed", "Cancelled"}
PRODUCT_STATUSES = {"active", "paused"}
SELLER_STATUSES = {"Pending", "Approved", "Rejected"}


def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def fail_if_unconfigured() -> None:
    if not DATABASE_CONFIGURED:
        raise HTTPException(503, "Database is not configured. Add DATABASE_URL in Vercel project settings.")


def seller_json(seller: Seller) -> dict[str, Any]:
    return {"id": seller.id, "contactName": seller.contact_name, "businessName": seller.business_name, "email": seller.email, "phone": seller.phone, "country": seller.country, "location": seller.location, "description": seller.description, "productName": seller.product_name, "productCategory": seller.product_category, "productPrice": seller.product_price, "productImageName": seller.product_image_name, "status": seller.status, "createdAt": seller.created_at.isoformat()}


def product_json(product: Product, include_image: bool = True) -> dict[str, Any]:
    image = product.image
    if include_image and product.image_data:
        image = f"data:{product.image_type};base64,{base64.b64encode(product.image_data).decode('ascii')}"
    return {"id": product.id, "name": product.name, "maker": product.maker, "seller": product.seller, "category": product.category, "price": product.price, "image": image, "alt": product.alt, "description": product.description, "label": product.label, "status": product.status}


def order_json(order: Order) -> dict[str, Any]:
    items = order.items if isinstance(order.items, list) else json.loads(order.items)
    customer = order.customer if isinstance(order.customer, dict) else json.loads(order.customer)
    return {"id": order.id, "customer": customer, "items": items, "total": order.total, "currency": order.currency, "paymentMethod": order.payment_method, "status": order.status, "createdAt": order.created_at.isoformat()}


def session_admin(request: Request, db) -> None:
    fail_if_unconfigured()
    token = request.cookies.get("enqu_admin_session", "")
    if not token:
        raise HTTPException(401, "Sign in to continue.")
    digest = hashlib.sha256(token.encode()).hexdigest()
    session = db.get(AdminSession, digest)
    expiry = session.expires_at if session else None
    if expiry and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if not session or expiry < datetime.now(timezone.utc):
        if session:
            db.delete(session)
            db.commit()
        raise HTTPException(401, "Your admin session has expired. Sign in again.")


def customer_session(request: Request, db) -> Customer:
    fail_if_unconfigured()
    token = request.cookies.get("enqu_customer_session", "")
    session = db.get(CustomerSession, hashlib.sha256(token.encode()).hexdigest()) if token else None
    expiry = session.expires_at if session else None
    if expiry and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if not session or expiry < datetime.now(timezone.utc):
        raise HTTPException(401, "Sign in to continue.")
    customer = db.get(Customer, session.customer_id)
    if not customer:
        raise HTTPException(401, "Sign in to continue.")
    return customer


def customer_json(customer: Customer) -> dict[str, Any]:
    return {"id": customer.id, "name": customer.name, "email": customer.email}


def password_digest(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1, dklen=32)
    return f"scrypt${base64.urlsafe_b64encode(salt).decode()}${base64.urlsafe_b64encode(digest).decode()}"


def password_matches(password: str, stored: str) -> bool:
    try:
        algorithm, salt_text, digest_text = stored.split("$", 2)
        if algorithm != "scrypt":
            return False
        salt = base64.urlsafe_b64decode(salt_text.encode())
        expected = base64.urlsafe_b64decode(digest_text.encode())
        actual = hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1, dklen=len(expected))
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def set_customer_session(response: JSONResponse, request: Request, db, customer: Customer, remember: bool) -> JSONResponse:
    duration = 30 * 24 * 60 * 60 if remember else 12 * 60 * 60
    raw_token = secrets.token_urlsafe(36)
    db.add(CustomerSession(token_hash=hashlib.sha256(raw_token.encode()).hexdigest(), customer_id=customer.id, expires_at=datetime.now(timezone.utc) + timedelta(seconds=duration)))
    db.commit()
    response.set_cookie("enqu_customer_session", raw_token, httponly=True, secure=request.url.scheme == "https" or request.headers.get("x-forwarded-proto") == "https", samesite="lax", max_age=duration, path="/")
    return response


def validate_text(value: Any, name: str, limit: int, required: bool = True) -> str:
    clean = str(value or "").strip()
    if required and not clean:
        raise HTTPException(422, f"{name} is required.")
    if len(clean) > limit:
        raise HTTPException(422, f"{name} must be {limit} characters or fewer.")
    return clean


def validate_email(value: Any, label: str = "Email") -> str:
    email = validate_text(value, label, 160).lower()
    local, separator, domain = email.partition("@")
    if (not separator or not local or not domain or "@" in domain or "." not in domain
            or domain.startswith(".") or domain.endswith(".") or any(character.isspace() for character in email)):
        raise HTTPException(422, "Enter a valid email address.")
    return email


def parse_number(value: Any, name: str, default: float | None = None) -> float:
    if value is None and default is not None:
        return default
    try:
        number = float(value)
    except (TypeError, ValueError):
        raise HTTPException(422, f"{name} must be a number.")
    if not math.isfinite(number):
        raise HTTPException(422, f"{name} must be a finite number.")
    return number


@app.get("/api/health")
def health():
    return {"status": "ok", "databaseConfigured": DATABASE_CONFIGURED}


@app.get("/api/products")
def public_products(db=Depends(db_session)):
    fail_if_unconfigured()
    products = db.scalars(select(Product).where(Product.status == "active").order_by(Product.created_at.desc())).all()
    return [product_json(product) for product in products]


@app.post("/api/account/register", status_code=201)
async def register_customer(request: Request, db=Depends(db_session)):
    fail_if_unconfigured()
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(400, "Send a valid account request.")
    if not isinstance(payload, dict):
        raise HTTPException(400, "Send a valid account request.")
    name = validate_text(payload.get("name"), "Name", 100)
    email = validate_email(payload.get("email"))
    password = str(payload.get("password", ""))
    if len(password) < 8 or len(password) > 256:
        raise HTTPException(422, "Password must be between 8 and 256 characters.")
    if db.scalar(select(Customer.id).where(Customer.email == email)):
        raise HTTPException(409, "An account with this email already exists. Sign in instead.")
    customer = Customer(id=f"customer-{secrets.token_urlsafe(12)}", name=name, email=email, password_hash=password_digest(password))
    db.add(customer)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "An account with this email already exists. Sign in instead.")
    response = JSONResponse({"customer": customer_json(customer)}, status_code=201)
    return set_customer_session(response, request, db, customer, False)


@app.post("/api/account/login")
async def login_customer(request: Request, db=Depends(db_session)):
    fail_if_unconfigured()
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(400, "Send a valid sign-in request.")
    if not isinstance(payload, dict):
        raise HTTPException(400, "Send a valid sign-in request.")
    email = validate_email(payload.get("email"))
    password = str(payload.get("password", ""))
    customer = db.scalar(select(Customer).where(Customer.email == email))
    if customer and not password_matches(password, customer.password_hash):
        raise HTTPException(401, "Email or password was not accepted. Create an account if you are new to ENQU MADE.")
    if not customer:
        if len(password) < 8 or len(password) > 256:
            raise HTTPException(422, "Password must be between 8 and 256 characters.")
        name = email.split("@", 1)[0].replace(".", " ").replace("_", " ").replace("-", " ").title()
        customer = Customer(id=f"customer-{secrets.token_urlsafe(12)}", name=name[:100], email=email, password_hash=password_digest(password))
        db.add(customer)
        try:
            db.commit()
            db.refresh(customer)
        except IntegrityError:
            db.rollback()
            customer = db.scalar(select(Customer).where(Customer.email == email))
            if not customer or not password_matches(password, customer.password_hash):
                raise HTTPException(401, "Email or password was not accepted.")
    response = JSONResponse({"customer": customer_json(customer)})
    return set_customer_session(response, request, db, customer, bool(payload.get("remember")))


@app.get("/api/account/session")
def get_customer_session(request: Request, db=Depends(db_session)):
    return {"customer": customer_json(customer_session(request, db))}


@app.post("/api/account/logout")
def logout_customer(request: Request, db=Depends(db_session)):
    token = request.cookies.get("enqu_customer_session", "")
    if token and DATABASE_CONFIGURED:
        session = db.get(CustomerSession, hashlib.sha256(token.encode()).hexdigest())
        if session:
            db.delete(session)
            db.commit()
    response = JSONResponse({"authenticated": False})
    response.delete_cookie("enqu_customer_session", path="/", httponly=True, samesite="lax")
    return response


@app.post("/api/sellers", status_code=201)
async def create_seller(request: Request, contactName: str = Form(...), businessName: str = Form(...), email: str = Form(...), phone: str = Form(""), country: str = Form(...), location: str = Form(...), description: str = Form(...), productName: str = Form(...), productCategory: str = Form(...), productPrice: float = Form(...), productImage: UploadFile | None = File(None), db=Depends(db_session)):
    fail_if_unconfigured()
    email = validate_text(email, "Email", 160).lower()
    if "@" not in email:
        raise HTTPException(422, "Enter a valid email address.")
    if productPrice <= 0 or productPrice > 100000000:
        raise HTTPException(422, "Product price must be greater than zero.")
    if db.scalar(select(Seller.id).where(Seller.email == email)):
        raise HTTPException(409, "An application for this email is already on file.")
    image_bytes, image_type, image_name = None, "", ""
    if productImage and productImage.filename:
        if productImage.content_type not in IMAGE_TYPES:
            raise HTTPException(415, "Upload a JPG, PNG, or WebP image.")
        image_bytes = await productImage.read(MAX_IMAGE_BYTES + 1)
        if len(image_bytes) > MAX_IMAGE_BYTES:
            raise HTTPException(413, "Product images must be 5 MB or smaller.")
        image_type, image_name = productImage.content_type, Path(productImage.filename).name[:240]
    seller = Seller(id=f"seller-{secrets.token_urlsafe(12)}", contact_name=validate_text(contactName,"Contact name",100), business_name=validate_text(businessName,"Business name",120), email=email, phone=validate_text(phone,"Phone",40,False), country=validate_text(country,"Country",80), location=validate_text(location,"Location",100), description=validate_text(description,"Description",1000), product_name=validate_text(productName,"Product name",120), product_category=validate_text(productCategory,"Product category",80), product_price=productPrice, product_image_name=image_name, product_image_type=image_type, product_image_data=image_bytes, status="Pending")
    db.add(seller); db.commit(); db.refresh(seller)
    return seller_json(seller)


@app.post("/api/orders", status_code=201)
async def create_order(request: Request, db=Depends(db_session)):
    fail_if_unconfigured()
    account = None
    try:
        account = customer_session(request, db)
    except HTTPException as error:
        if error.status_code != 401:
            raise
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(400, "Send a valid order request.")
    if not isinstance(payload, dict):
        raise HTTPException(400, "Send a valid order request.")
    customer = payload.get("customer") or {}
    if not isinstance(customer, dict):
        raise HTTPException(422, "Customer details are invalid.")
    name = account.name if account else validate_text(customer.get("name"), "Customer name", 120)
    email = account.email if account else validate_email(customer.get("email"), "Customer email")
    country = validate_text(customer.get("country"), "Country", 80)
    requested = payload.get("items")
    if not isinstance(requested, list) or not requested or len(requested) > 50:
        raise HTTPException(422, "Add at least one product to the order.")
    items, total = [], 0.0
    for item in requested:
        if not isinstance(item, dict):
            raise HTTPException(422, "Order item is invalid.")
        product = db.get(Product, str(item.get("productId", "")))
        if not product or product.status != "active":
            raise HTTPException(409, "A selected product is no longer available.")
        try:
            quantity = int(item.get("quantity", 0))
            gift_bag_quantity = int(item.get("giftBagQuantity", 0))
        except (TypeError, ValueError):
            raise HTTPException(422, "Product quantity is invalid.")
        if not 1 <= quantity <= 100 or not 0 <= gift_bag_quantity <= quantity:
            raise HTTPException(422, "Product quantity is invalid.")
        line_total = product.price * quantity + 150 * gift_bag_quantity
        total += line_total
        items.append({"productId": product.id, "name": product.name, "seller": product.seller or product.maker, "unitPrice": product.price, "quantity": quantity, "giftBagQuantity": gift_bag_quantity})
    customer_details = {"name": name, "email": email, "country": country}
    if account:
        customer_details["customerId"] = account.id
    order = Order(id=f"ENQ-{secrets.token_hex(5).upper()}", customer=customer_details, items=items, total=round(total, 2), currency="ETB", payment_method=validate_text(payload.get("paymentMethod"), "Payment method", 80), status="New")
    db.add(order); db.commit(); db.refresh(order)
    return order_json(order)


@app.get("/api/seller/wallet")
def seller_wallet(request: Request, db=Depends(db_session)):
    account = customer_session(request, db)
    seller = db.scalar(select(Seller).where(Seller.email == account.email))
    if not seller:
        raise HTTPException(404, "No seller application is connected to this account email.")
    if seller.status != "Approved":
        raise HTTPException(403, "Your seller application must be approved before wallet earnings are available.")
    settings = {item.key: item.value for item in db.scalars(select(Setting)).all()}
    commission_rate = float(settings.get("commissionRate", "10"))
    seller_orders = db.scalars(select(Order).where(Order.status.in_(["New", "Processing", "Completed"])).order_by(Order.created_at.desc())).all()
    transactions = []
    completed_gross = 0.0
    pending_gross = 0.0
    for order in seller_orders:
        order_items = order.items if isinstance(order.items, list) else json.loads(order.items)
        seller_gross = sum(float(item.get("unitPrice", 0)) * int(item.get("quantity", 0)) for item in order_items if item.get("seller") == seller.business_name)
        if seller_gross:
            net = round(seller_gross * (1 - commission_rate / 100), 2)
            if order.status == "Completed":
                completed_gross += seller_gross
            else:
                pending_gross += seller_gross
            transactions.append({"orderId": order.id, "date": order.created_at.isoformat(), "status": order.status, "gross": round(seller_gross, 2), "commission": round(seller_gross - net, 2), "net": net})
    return {"seller": seller.business_name, "status": seller.status, "currency": "ETB", "commissionRate": commission_rate, "grossSales": round(completed_gross, 2), "commission": round(completed_gross * commission_rate / 100, 2), "availableBalance": round(completed_gross * (1 - commission_rate / 100), 2), "pendingEarnings": round(pending_gross * (1 - commission_rate / 100), 2), "transactions": transactions}


@app.post("/api/admin/login")
async def admin_login(request: Request, db=Depends(db_session)):
    fail_if_unconfigured()
    configured = os.getenv("ADMIN_PASSWORD", "")
    if not configured:
        raise HTTPException(503, "Set ADMIN_PASSWORD in the server environment before enabling admin sign-in.")
    try:
        password = str((await request.json()).get("password", ""))
    except Exception:
        raise HTTPException(400, "Send a valid sign-in request.")
    if not hmac.compare_digest(password.encode(), configured.encode()):
        raise HTTPException(401, "Email or password was not accepted.")
    raw_token = secrets.token_urlsafe(36)
    digest = hashlib.sha256(raw_token.encode()).hexdigest()
    expires = datetime.now(timezone.utc) + timedelta(hours=12)
    db.add(AdminSession(token_hash=digest, expires_at=expires)); db.commit()
    response = JSONResponse({"authenticated": True, "expiresAt": expires.isoformat()})
    response.set_cookie("enqu_admin_session", raw_token, httponly=True, secure=request.url.scheme == "https" or request.headers.get("x-forwarded-proto") == "https", samesite="strict", max_age=12 * 60 * 60, path="/")
    return response


@app.get("/api/admin/session")
def admin_session(request: Request, db=Depends(db_session)):
    session_admin(request, db)
    return {"authenticated": True}


@app.post("/api/admin/logout")
def admin_logout(request: Request, db=Depends(db_session)):
    token=request.cookies.get("enqu_admin_session", "")
    if token and DATABASE_CONFIGURED:
        session=db.get(AdminSession, hashlib.sha256(token.encode()).hexdigest())
        if session: db.delete(session); db.commit()
    response=JSONResponse({"authenticated": False})
    response.delete_cookie("enqu_admin_session", path="/", httponly=True, samesite="strict")
    return response


@app.get("/api/admin/sellers")
def admin_sellers(request: Request, db=Depends(db_session)):
    session_admin(request, db)
    return [seller_json(seller) for seller in db.scalars(select(Seller).order_by(Seller.created_at.desc())).all()]


@app.patch("/api/admin/sellers/{seller_id}")
async def update_seller(seller_id: str, request: Request, db=Depends(db_session)):
    session_admin(request, db)
    seller=db.get(Seller,seller_id)
    if not seller: raise HTTPException(404,"Seller not found.")
    status=str((await request.json()).get("status",""))
    if status not in SELLER_STATUSES: raise HTTPException(422,"Invalid seller status.")
    previous=seller.status; seller.status=status
    if status=="Approved" and previous!="Approved" and not db.scalar(select(Product.id).where(Product.seller==seller.business_name)):
        db.add(Product(id=f"seller-product-{secrets.token_urlsafe(10)}",name=seller.product_name,maker=seller.business_name,seller=seller.business_name,category=seller.product_category,price=seller.product_price,image="",image_type=seller.product_image_type,image_data=seller.product_image_data,alt=seller.product_name,description=seller.description,label="Seller featured",status="active"))
    db.commit(); db.refresh(seller)
    return seller_json(seller)


@app.get("/api/admin/products")
def admin_products(request: Request, db=Depends(db_session)):
    session_admin(request, db)
    return [product_json(product) for product in db.scalars(select(Product).order_by(Product.created_at.desc())).all()]


@app.post("/api/admin/products", status_code=201)
async def admin_create_product(request: Request, db=Depends(db_session)):
    session_admin(request, db); payload=await request.json()
    if not isinstance(payload, dict): raise HTTPException(400,"Send a valid product.")
    price=parse_number(payload.get("price"),"Price",0)
    if price<=0: raise HTTPException(422,"Price must be greater than zero.")
    name=validate_text(payload.get("name"),"Product name",120); seller=validate_text(payload.get("seller"),"Seller name",120); category=validate_text(payload.get("category"),"Category",80)
    product=Product(id=f"product-{secrets.token_urlsafe(10)}",name=name,maker=seller,seller=seller,category=category,price=price,image="Asset/downnload.jpg",alt=name,description=f"A handmade {category.lower()} piece by {seller}.",label="New arrival",status="active")
    db.add(product); db.commit(); db.refresh(product)
    return product_json(product)


@app.patch("/api/admin/products/{product_id}")
async def admin_update_product(product_id: str, request: Request, db=Depends(db_session)):
    session_admin(request,db); product=db.get(Product,product_id)
    if not product: raise HTTPException(404,"Product not found.")
    status=str((await request.json()).get("status",""))
    if status not in PRODUCT_STATUSES: raise HTTPException(422,"Invalid product status.")
    product.status=status; db.commit(); return product_json(product)


@app.delete("/api/admin/products/{product_id}")
def admin_delete_product(product_id: str, request: Request, db=Depends(db_session)):
    session_admin(request,db); product=db.get(Product,product_id)
    if not product: raise HTTPException(404,"Product not found.")
    db.delete(product); db.commit(); return {"deleted":True}


@app.get("/api/admin/orders")
def admin_orders(request: Request, db=Depends(db_session)):
    session_admin(request,db)
    return [order_json(order) for order in db.scalars(select(Order).order_by(Order.created_at.desc())).all()]


@app.patch("/api/admin/orders/{order_id}")
async def admin_update_order(order_id: str, request: Request, db=Depends(db_session)):
    session_admin(request,db); order=db.get(Order,order_id)
    if not order: raise HTTPException(404,"Order not found.")
    status=str((await request.json()).get("status",""))
    if status not in ORDER_STATUSES: raise HTTPException(422,"Invalid order status.")
    order.status=status; db.commit(); return order_json(order)


@app.get("/api/admin/settings")
def admin_settings(request: Request, db=Depends(db_session)):
    session_admin(request,db)
    values={item.key:item.value for item in db.scalars(select(Setting)).all()}
    return {"commissionRate":float(values.get("commissionRate","10")),"marketingSpend":float(values.get("marketingSpend","0"))}


@app.put("/api/admin/settings")
async def update_admin_settings(request: Request, db=Depends(db_session)):
    session_admin(request,db); payload=await request.json()
    if not isinstance(payload, dict): raise HTTPException(400,"Send valid metric assumptions.")
    commission=max(0,min(100,parse_number(payload.get("commissionRate"),"Platform fee",10)))
    spend=max(0,parse_number(payload.get("marketingSpend"),"Marketing spend",0))
    for key,value in (("commissionRate",commission),("marketingSpend",spend)):
        setting=db.get(Setting,key)
        if setting: setting.value=str(value)
        else: db.add(Setting(key=key,value=str(value)))
    db.commit(); return {"commissionRate":commission,"marketingSpend":spend}


class PublicSiteFiles(StaticFiles):
    public_suffixes = {".html", ".css", ".js", ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".mp4"}

    async def get_response(self, path: str, scope):
        requested = (ROOT / path).resolve()
        if not requested.is_relative_to(ROOT) or (path and requested.suffix.lower() not in self.public_suffixes):
            raise StarletteHTTPException(status_code=404)
        return await super().get_response(path, scope)


app.mount("/", PublicSiteFiles(directory=ROOT, html=True), name="site")
