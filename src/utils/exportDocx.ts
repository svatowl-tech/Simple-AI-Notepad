import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export const exportToDocx = async (htmlContent: string, filename: string = 'document.docx') => {
  // A very basic HTML to DOCX converter for this example.
  // In a real app, you'd want a more robust HTML parser like html-to-docx.
  
  // Strip HTML tags and split by paragraphs (divs or ps)
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const paragraphs: Paragraph[] = [];
  
  // Iterate over child nodes to create paragraphs
  tempDiv.childNodes.forEach((node) => {
    if (node.nodeName === 'P' || node.nodeName === 'H1' || node.nodeName === 'H2' || node.nodeName === 'H3') {
      const text = node.textContent || '';
      if (text.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: text,
                bold: node.nodeName.startsWith('H'),
                size: node.nodeName === 'H1' ? 48 : node.nodeName === 'H2' ? 36 : node.nodeName === 'H3' ? 28 : 24,
              }),
            ],
          })
        );
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(text)],
          })
        );
      }
    }
  });

  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({ children: [new TextRun("Empty Document")] }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
