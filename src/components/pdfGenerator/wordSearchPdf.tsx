import React, { FC } from 'react';
import {
  Page, Text, View, Document, Image, StyleSheet, Svg, Font,
} from '@react-pdf/renderer';
// @ts-ignore
import PoppinsBold from '../../assets/fonts/Poppins-Bold.ttf';

import Cell from '../cell';

Font.register({ family: 'Poppins', src: PoppinsBold });

// Create styles
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: 'Poppins',
  },
  image: {
    height: 450,
    width: 450,
  },
  wordList: {
    width: 450,
    // height: 200,
  },
  page: {
    // display: 'flex',
    // flexDirection: 'row',
    // backgroundColor: '#E4E4E4',
  },
  section: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // width: '100%',
    textAlign: 'center',

  },
  title: {
    marginBottom: 20,
    marginTop: 42,
    fontSize: 25,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    maxWidth: 450,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    maxWidth: 450,
    lineHeight: 1.5,
  },
  list: {
    textTransform: 'uppercase',
    fontSize: 14,
  },
});

// eslint-disable-next-line no-shadow
// export enum PdfSizes {
//  A4 = 'A4',
//  LETTER = 'LETTER',
//  A6 = 'A6',
//  A7 = 'A7'
// }
type pdfSizesListProps = {
  name: string,
  size: [number, number]
}
export const pdfSizesList: pdfSizesListProps[] = [
  { name: 'A4', size: [595.28, 841.89] },
  { name: '8.5 x 11', size: [612, 792] },
  { name: '8 x 10', size: [576, 720] },
  { name: '6 x 9', size: [432, 648] },
  { name: '5.5 x 8.5', size: [396, 612] },
];

type MyDocumentProps ={
  imageUrl: any
  title: string
  subtitle: string
  listHeight: number
  imageWidth: number
  size: [number, number]
  wordSearchImageUrl: any
}

const MyDocument: FC<MyDocumentProps> = ({
  imageUrl, title, subtitle, listHeight, imageWidth, size, wordSearchImageUrl,
}) => (
  <Document>
    <Page size={size} style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Image
          style={{ width: imageWidth, height: imageWidth }}
          src={imageUrl}
        />
        <Image style={{ height: listHeight, width: imageWidth }} src={wordSearchImageUrl} />
      </View>
    </Page>
  </Document>
);

export default MyDocument;
