from utils.cloudinary import cloudinary
import cloudinary.uploader

def uploadResumeToCloudinary(file):
    try:
        response = cloudinary.uploader.upload(
            file,
            resource_type="auto",
            use_filename=True,
            unique_filename=True, 
            
        )
        return response["secure_url"], response["public_id"]
    except Exception as e:
        return None

def deleteResumeFromCloudinary(public_id):
    try:
        response = cloudinary.uploader.destroy(
            public_id,
            resource_type="image" 
        )
        return response
    except Exception as e:
        return None