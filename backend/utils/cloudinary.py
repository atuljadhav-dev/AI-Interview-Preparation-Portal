import cloudinary
from dotenv import load_dotenv
import os

load_dotenv()

cloudinaryCloudName = os.getenv('CLOUDINARY_CLOUD_NAME')
cloudinaryApiKey = os.getenv('CLOUDINARY_API_KEY')
cloudinaryApiSecret = os.getenv('CLOUDINARY_API_SECRET')

cloudinary.config(
    cloud_name = cloudinaryCloudName ,
    api_key = cloudinaryApiKey ,
    api_secret =cloudinaryApiSecret , 
    secure = True
)