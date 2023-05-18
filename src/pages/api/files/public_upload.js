
export default async (req, res) => {
    
    const result = await new Promise(async (resolve, reject) => {
        const data = true;
        try {

          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
      
    res.status(200).json({result: result});
  }
  