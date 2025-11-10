import QRCode from 'qrcode';

export async function generateQrCode(data: string) {
  return QRCode.toDataURL(data, {
    errorCorrectionLevel: 'M',
    margin: 2,
    color: {
      dark: '#0a6eff',
      light: '#ffffff',
    },
  });
}

