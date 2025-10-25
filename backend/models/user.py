from pydantic import BaseModel, EmailStr, field_validator
import re

class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    @field_validator('name')
    def validate_name_length(cls, value):
        if len(value) < 5:
            raise ValueError("Name should have at least 5 characters.")
        return value
    @field_validator('phone')
    def validate_phone_number(cls, value):
        phone_str = str(value)
        indian_phone_regex = r'^(\+91)?[6-9]\d{9}$'
        if not re.match(indian_phone_regex, phone_str):
            raise ValueError('Invalid phone number format.')
        return phone_str

    @field_validator('password')
    def validate_password_strength(cls, value):
        if len(value) < 8:
            raise ValueError('Password must be at least 8 characters long.')
        if not re.search(r'[a-z]', value):
            raise ValueError('Password must contain a lowercase letter.')
        if not re.search(r'[A-Z]', value):
            raise ValueError('Password must contain an uppercase letter.')
        if not re.search(r'\d', value):
            raise ValueError('Password must contain a digit.')
        if not re.search(r'[@$!%*?&]', value):
            raise ValueError('Password must contain a special character.')
        return value