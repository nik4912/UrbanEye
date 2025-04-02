import { Request, Response, NextFunction } from "express";
import path from "path";

// Extend the Express Request type to include files from Multer
interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

export const CREATE_COMPLAINTS = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("IN THE COMPLAINTS CREATION FUNCTION");
    console.log("Request Body:", request.body);
    
    // Get the uploaded files from Multer
    const files = (request as MulterRequest).files;
    console.log("Uploaded Files:", files);
    
    // Extract file paths for storage in database
    const imagePaths = files ? files.map(file => {
      // Get relative path for storage in database
      return `/uploads/complaints/${path.basename(file.path)}`;
    }) : [];
    
    // Here you would normally save the complaint to the database
    // Including the image paths
    
    response.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: {
        ...request.body,
        images: imagePaths
      },
    });
  } catch (error : any) {
    console.error("Error creating complaint:", error);
    response.status(500).json({
      success: false,
      message: "Error creating complaint",
      error: error.message
    });
  }
};