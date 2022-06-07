const fs = require('fs')

const deleteFile = (filePath) => {
  const updatedFilePath = filePath.replace(filePath[0], '')
  fs.unlink(updatedFilePath, (error) => {
    if(error) {
      throw(error)
    }
  })
}

module.exports = { deleteFile }