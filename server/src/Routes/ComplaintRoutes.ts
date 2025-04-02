import { Router } from "express";
import { upload } from "../configurations/multer_config";

import { CREATE_COMPLAINTS } from "../controllers/ComplaintsController";

const ComplaintRoutes = Router();

ComplaintRoutes.post("/create-complaint", upload.array("images", 5), CREATE_COMPLAINTS);
export default ComplaintRoutes;