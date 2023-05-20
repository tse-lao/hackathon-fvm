function FileUpload({ uploadFile, loadingFile, file }) {
    if (loadingFile) {
      return <LoadingSpinner />;
    } else if (!file) {
      return (
        <div>
          <label htmlFor="upload" className="block text-sm font-medium text-gray-700">
            Upload Opendataset
          </label>
          <input type="file" name="job" id="job" onChange={uploadFile} required accept="*" />
        </div>
      );
    } else {
      return (
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Your open dataset
          </label>
          <span className="text-sm">
            {file.cid} || {file.pieceCid} || {file.metadata}
          </span>
        </div>
      );
    }
  }
  