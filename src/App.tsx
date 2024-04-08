import './App.css';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import SavedQRCodeSection from './SavedQrCodesSection';

function App() {
  const [url, setUrl] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [qrCodeUrlSaves, setQrCodeUrlSaves] = useState<string[]>([]);

  useEffect(() => {
    const savedQrCodeUrlSaves = localStorage.getItem('qrCodeUrlSaves');
    if (savedQrCodeUrlSaves) {
      setQrCodeUrlSaves(JSON.parse(savedQrCodeUrlSaves));
    }
  }, []);

  const saveQRCode = () => {
    if (qrCodeUrlSaves.includes(url)) {
      toast.warning('¡Esta URL ya ha sido guardada previamente!');
      return;
    } else {
      setQrCodeUrlSaves(prevUrls => {
        const updatedUrls = [...prevUrls, url];
        localStorage.setItem('qrCodeUrlSaves', JSON.stringify(updatedUrls));
        toast.success('¡Tu código QR ha sido guardado!');
        return updatedUrls;
      });
    }
  }

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const generateQRCode = async () => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`);
      const qrCode = await response.blob();
      
      setImageSrc(URL.createObjectURL(qrCode));
  
      toast.success('¡Código QR generado exitosamente!');
    } catch (error) {
      toast.error('¡Hubo un error al generar el código QR!');
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('¡Por favor ingresa una URL válida!');
      return;
    }

    generateQRCode();
  }

  const handleRegenerate = async (url: string) => {
    if (!url.trim()) {
      toast.error('¡La URL es inválida!');
      return;
    }

    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`);
      const qrCode = await response.blob();
      
      setImageSrc(URL.createObjectURL(qrCode));
  
      toast.success('¡Código QR regenerado exitosamente!');
    } catch (error) {
      toast.error('¡Hubo un error al regenerar el código QR!');
    }
  };

  return (
    <div className='App w-full h-auto py-10 bg-slate-500 flex flex-col justify-center items-center gap-y-10'>
      <Toaster richColors expand={true} position="bottom-right"/>
      <h1 className='text-3xl text-white text-center'>Generador de código QR</h1>
      
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-y-10 w-1/2 p-2'>
        <input 
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          minLength={8}
          required
          className='rounded-md w-full p-1 border-2 border-slate-600 focus:outline-none focus:border-slate-800'
        />

        <input type="submit" value="Generar" className='p-2 text-white bg-slate-600 w-3/12 cursor-pointer' />
      </form>

      {imageSrc &&
        <div className="qrCode-container flex flex-col items-center justify-center w-1/5 h-auto rounded-lg p-5 bg-gray-300 gap-y-5">
          <img src={imageSrc} alt="QR Code" />
          
          <div className="btn-container w-full flex justify-center items-center gap-x-2">
            <button onClick={saveQRCode} className='p-2 w-full text-white bg-slate-600 cursor-pointer rounded-md'>Guardar</button>
            <button onClick={downloadQRCode} className='p-2 w-full text-white bg-slate-600 cursor-pointer rounded-md'>Descargar</button>
          </div>
        </div>
      }

      <SavedQRCodeSection qrCodeUrls={qrCodeUrlSaves} handleRegenerate={handleRegenerate} />
    </div>
  );
}

export default App;
