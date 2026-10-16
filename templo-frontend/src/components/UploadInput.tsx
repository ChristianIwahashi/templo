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
  
  //Guarda o nome real do arquivo
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

      //Salva a URL da nuvem no estado do formulário pai
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

  //Função que oculta a URL da nuvem e exibe apenas o nome limpo do arquivo
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
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
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

      {/*ARQUIVO ANEXADO*/}
      {value ? (
        <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden pr-2">
            <Check className="w-4 h-4 text-green-600 shrink-0" />
            <FileText className="w-4 h-4 text-sys-blue shrink-0" />
            <span className="font-semibold text-gray-800 truncate">
              {formatarNomeExibicao(value)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemoverArquivo}
            disabled={disabled}
            className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
            title="Remover / Substituir arquivo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /*BOTÃO DE SELEÇÃO*/
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="w-full p-6 border-2 border-dashed border-gray-200 hover:border-sys-blue rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 text-gray-500 hover:text-sys-blue disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-sys-blue" />
                <span className="font-semibold text-xs text-sys-blue">Transmitindo para o servidor...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-sys-blue" />
                <span className="font-semibold text-xs text-gray-700">Clique para selecionar do computador</span>
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