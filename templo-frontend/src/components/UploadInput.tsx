import { useState, type ChangeEvent, useRef } from "react";
import { Api } from "../api/Api";
import { UploadCloud, Check, Loader2, X } from "lucide-react";
import { AxiosError } from "axios";

interface UploadInputProps {
  label: string;
  accept?: string;
  value: string;
  onChange: (url: string) => void; // Atualiza o estado com a URL do R2
  disabled?: boolean;
}

export function UploadInput({
  label,
  accept = ".pdf,.png,.jpg,.jpeg,.docx,.xlsx",
  value,
  onChange,
  disabled = false
}: UploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErro('');

    try {
      //Prepara o arquivo físico para transmissão
      const formData = new FormData();
      formData.append('file', file);

      //Envia para a API do NestJS (que transmite para o Cloudflare R2)
      const response = await Api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      //Avisa o formulário pai que a URL da nuvem está pronta!
      onChange(response.data.url);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Falha ao enviar arquivo para a nuvem.');
      } else {
        setErro('Erro no upload.');
      }
    } finally {
      setUploading(false);
    }
  }

  function handleRemoverArquivo() {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-1.5 text-sm">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>

      {/*Input de arquivo nativo invisível acionado pelo botão visual*/}
      <input 
        ref={fileInputRef}
        type="file" 
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden" 
        id="hidden-file-input"
      />

      {/*Arquivo já enviado para a Nuvem*/}
      {value ? (
        <div className="flex items-center justify-between p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs">
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <Check className="w-4 h-4 text-green-600 shrink-0" />
            <span className="font-medium text-gray-700 truncate" title={value}>
              Arquivo na Nuvem: {value}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemoverArquivo}
            disabled={disabled}
            className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
            title="Substituir arquivo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /*Botão de Escolher Arquivo do Computador*/
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className={`w-full p-4 border-2 border-dashed border-gray-200 hover:border-sys-blue rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 text-gray-500 hover:text-sys-blue disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-sys-blue" />
                <span className="font-semibold text-xs text-sys-blue">Transmitindo para o Cloudflare R2...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-6 h-6" />
                <span className="font-semibold text-xs">Clique para selecionar do computador</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">PDF, Imagens, Documentos</span>
              </>
            )}
          </button>
        </div>
      )}

      {/*Feedback de Erro*/}
      {erro && (
        <p className="text-xs text-red-500 font-semibold">{erro}</p>
      )}
    </div>
  );
}