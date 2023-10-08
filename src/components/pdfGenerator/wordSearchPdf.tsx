import React, { FC } from 'react';
import {
  Page, Text, View, Document, Image, StyleSheet, Svg, Font,
} from '@react-pdf/renderer';
// @ts-ignore
import PoppinsBold from '../../assets/fonts/Poppins-Bold.ttf';

import Cell from '../cell';

Font.register({ family: 'Poppins', src: PoppinsBold });

const styles = StyleSheet.create({
  section: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

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
  size: [number, number]
  wordSearchImageUrl: string
}

// rename helper for react18 overload
const MyDocumentNoType: any = Document;
const MyPage: any = Page;

const MyDocument: FC<MyDocumentProps> = ({
  size, wordSearchImageUrl,
}) => (
  <MyDocumentNoType>
    {size && wordSearchImageUrl
    && (
    <MyPage size={size}>
      <View style={styles.section}>
        <Image style={{ height: size[1], width: size[0] }} src={wordSearchImageUrl} />
      </View>
    </MyPage>
    )}
  </MyDocumentNoType>
);

export default MyDocument;
