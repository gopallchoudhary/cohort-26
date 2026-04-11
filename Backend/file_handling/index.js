import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
import upload from "./config/multer.js";
import uploadToImagekit from "./utils/uploadToImagekit.js";
import 'dotenv/config';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/test", (req, res) => {

    res.json({
        message: "testing the express app"
    })
});

app.post("/upload", upload.single('avatar'), async (req, res) => {
    console.log(req.body);
    console.log(req.file);

    const uploadImage = await uploadToImagekit(
        req.file.buffer,
        req.file.originalname,
        "avatars"
    );

    res.status(200).json({
        message: "File uploaded successfully!",
        url: uploadImage.url,
    })
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
