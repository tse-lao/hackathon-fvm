
export default async (req, res) => {
    const result = await new Promise(async (resolve, reject) => {
        resolve(true);
    });
    
    return res.status(200).json({result});
  }
  