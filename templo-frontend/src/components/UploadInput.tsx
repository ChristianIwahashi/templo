import { useState, type ChangeEvent, useRef } from "react";
import { Api } from "../api/Api";
import { UploadCloud, Check, Loader2, X, FileText } from "lucide-react";
import { AxiosError } from "axios";

interface UploadInputProps {
  label: string;
  accept?: string;
  value: string;
  onChange: (url: string) => void;
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
  const [nomeArquivoLocal, setNomeArquivoLocal] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setNomeArquivoLocal(file.name);
    setUploading(true);
    setErro('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await Api.post('/upload', formData);
      onChange(response.data.url);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Falha ao enviar arquivo.');
      } else {
        setErro('Erro no upload.');
      }
    } finally {
      setUploading(false);
    }
  }

  function handleRemoverArquivo() {
    onChange('');
    setNomeArquivoLocal('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function formatarNomeExibicao(url: string): string {
    if (nomeArquivoLocal) return nomeArquivoLocal;
    if (!url) return '';
    try {
      const parteFinal = url.split('/').pop() || 'Arquivo Anexo';
      return decodeURIComponent(parteFinal.replace(/^\d+-\d+-?/, ''));
    } catch {
      return 'Arquivo anexado com sucesso';
    }
  }

  return (
    <div className="space-y-1.5 text-sm">
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </label>

      <input 
        ref={fileInputRef}
        type="file" 
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden" 
      />

      {value ? (
        <div className="flex items-center justify-between p-3 bg-blue-50/70 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden pr-2">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
            <FileText className="w-4 h-4 text-sys-blue shrink-0" />
            <span className="font-semibold text-gray-800 dark:text-slate-200 truncate">
              {formatarNomeExibicao(value)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemoverArquivo}
            disabled={disabled}
            className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
            title="Remover arquivo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="w-full p-6 border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-sys-blue dark:hover:border-sys-blue rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/20 text-gray-500 dark:text-slate-400 hover:text-sys-blue disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-sys-blue" />
                <span className="font-semibold text-xs text-sys-blue">Transmitindo para o servidor...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-sys-blue" />
                <span className="font-semibold text-xs text-gray-700 dark:text-slate-300">Clique para selecionar do computador</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">PDF, Imagens, Documentos (Máx: 20 MB)</span>
              </>
            )}
          </button>
        </div>
      )}

      {erro && (
        <p className="text-xs text-red-500 font-semibold">{erro}</p>
      )}
    </div>
  );
}