import { faFileDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FC } from 'react';
import MyDocument from './pdfGenerator/wordSearchPdf';
import './cell.css';
// import {PdfSizes} from ''

type DownloadPdfLinkProps = {
  size: [number, number]
  wordSearchImageUrl: string
}

const DownloadPdfLink: FC<DownloadPdfLinkProps> = ({
  size, wordSearchImageUrl,
}) => (
  <div className="downloadWrapper">
    <PDFDownloadLink
      className="toolbarButton"
      document={(
        <MyDocument
          size={size}
          wordSearchImageUrl={wordSearchImageUrl}
        />
)}
      fileName="word-search-maze.pdf"
    >
      {({
        blob,
        url,
        loading,
      }) => (loading
        ? (
          <div>
            <FontAwesomeIcon className="buttonIcon" icon={faFilePdf} />
            <span>Loading...</span>
          </div>
        )
        : (
          <div>
            <FontAwesomeIcon className="buttonIcon" icon={faFilePdf} />
            <span>PDF</span>
          </div>
        ))}
    </PDFDownloadLink>
  </div>
);

export default DownloadPdfLink;
