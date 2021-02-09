const Busboy = require('busboy');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

formData = (req, res, next) => {
  const busboy = new Busboy({ headers: req.headers })
  req.body = {}
  busboy.on('field', (key, val) => {
    req.body[key] = val
  })

  busboy.on('file', (key, profileImage ) => {
    const stream = cloudinary.uploader.upload_stream(
      (err, res) => {
        if (err) throw new Error('Something went wrong!')
        req.body[key] = res.secure_url
        next();
      }
    )
    profileImage.on('data', data => {
      console.log(data)
      stream.write(data)
    })
    profileImage.on('end', () => {
      console.log('finish')
      stream.end()
    })
  })
  req.pipe(busboy)
}
module.exports = formData
