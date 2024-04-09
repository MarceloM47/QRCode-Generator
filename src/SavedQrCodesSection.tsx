interface QrCodesProps {
  qrCodeUrls: string[];
  handleRegenerate: (url: string) => void;
}

function SavedQRCodeSection({ qrCodeUrls, handleRegenerate }: QrCodesProps) {
  const reversedUrls = [...qrCodeUrls].reverse();

  return (
    <div className="saved-qrcodes p-4 md:p-10">
      <h2 className="text-2xl text-white mb-4">URLs Guardadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reversedUrls.map((url, index) => (
          <div key={index} className="qrCode-container flex flex-col items-center justify-center rounded-lg p-5 bg-gray-300 gap-y-5">
            <div className="btn-container w-full flex flex-col justify-center items-center gap-4">
              <p className="text-center">{url}</p>
              <button onClick={() => handleRegenerate(url)} className='p-2 w-3/4 text-white bg-slate-600 cursor-pointer rounded-md'>Regenerar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedQRCodeSection;
