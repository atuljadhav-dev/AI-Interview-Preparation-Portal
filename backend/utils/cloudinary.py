import cloudinary
from dotenv import load_dotenv
import os

load_dotenv()

cloudinary_cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
cloudinary_api_key = os.getenv('CLOUDINARY_API_KEY')
cloudinary_api_secret = os.getenv('CLOUDINARY_API_SECRET')

cloudinary.config(
    cloud_name = cloudinary_cloud_name ,
    api_key = cloudinary_api_key ,
    api_secret =cloudinary_api_secret , 
    secure = True
)