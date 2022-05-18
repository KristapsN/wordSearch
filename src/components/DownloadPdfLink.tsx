import { faFileDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FC } from 'react';
import MyDocument from './pdfGenerator/wordSearchPdf';
import style from './cell.module.scss';
// import {PdfSizes} from ''

type DownloadPdfLinkProps = {
  imageUrls: string
  title: string
  subtitle: string
  listHeight: number
  imageWidth: number
  size: [number, number]
  wordSearchImageUrl: string
  disabled?: boolean;
}

const DownloadPdfLink: FC<DownloadPdfLinkProps> = ({
  imageUrls, title, subtitle, listHeight, size, wordSearchImageUrl, imageWidth, disabled,
}) => (
  <div className={style.downloadWrapper}>
    <PDFDownloadLink
      className={style.toolbarButton}
      document={(
        <MyDocument
          imageUrl={imageUrls}
          title={title}
          subtitle={subtitle}
          listHeight={listHeight}
          size={size}
          wordSearchImageUrl={wordSearchImageUrl}
          imageWidth={imageWidth}
        />
)}
      fileName="somename.pdf"
    >
      {({
        blob,
        url,
        loading,
      }) => (loading
        ? (
          <div>
            <FontAwesomeIcon className={style.buttonIcon} icon={faFilePdf} />
            <span>Loading...</span>
          </div>
        )
        : (
          <div>
            <FontAwesomeIcon className={style.buttonIcon} icon={faFilePdf} />
            <span>PDF</span>
          </div>
        ))}
    </PDFDownloadLink>
  </div>
);

export default DownloadPdfLink;
