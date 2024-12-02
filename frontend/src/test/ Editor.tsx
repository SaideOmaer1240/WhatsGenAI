import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Estilo padrão do Quill

const Editor: React.FC = () => {
  const [text, setText] = useState<string>(''); // Define o estado como string

  const handleTextChange = (value: string) => {
    setText(value); // Atualiza o estado com o valor do editor
  };

  return (
    <div>
      <ReactQuill
        value={text}
        onChange={handleTextChange}
        theme="snow"
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'], // Botões de formatação
            [{ list: 'ordered' }, { list: 'bullet' }], // Listas
            ['link', 'image'], // Link e imagem
            ['clean'], // Remover formatação
          ],
        }}
        formats={[
          'bold',
          'italic',
          'underline',
          'list',
          'bullet',
          'link',
          'image',
        ]}
      />
      <button onClick={() => console.log(text)}>Publicar</button>
    </div>
  );
};

export default Editor;
