import jwt from 'jsonwebtoken'

const checkAdmin = (req, res, done) => {
  if (req.headers.authorization === undefined) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }

  const token = req.headers.authorization.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: 'Unauthorized' })
      return
    }
    if (decoded.role !== 'ADMIN') {
      res.status(403).send({ message: 'Forbidden' })
      return
    }
  })

  done()
}

export default checkAdmin
