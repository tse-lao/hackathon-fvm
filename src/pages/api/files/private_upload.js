import FormData from 'form-data';
import multer from 'multer';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer().array('uploadedFiles');

export default async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({error: err});
    } else if (err) {
      return res.status(500).json({error: err});
    }

    const { accessToken } = req.body;
    var form = new FormData();

    req.files.forEach((file) => {
      // Create a stream from the buffer
      const fileStream = new Readable();
      fileStream.push(file.buffer);
      fileStream.push(null);

      form.append("file", fileStream, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    });

    try {
      const endpoint = `https://data-depot.lighthouse.storage/api/upload/upload_files`;
      let check = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...form.getHeaders()
        },
        body: form
      });
      const result = await check.json();
      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({error});
    }
  });
}
