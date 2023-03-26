const pdf = require('pdfjs');
const fs = require('fs');
const path = require('path');


exports.generateInvoicePDF = async (invoices, dataCallback, endCallback) => {
  const doc = new pdf.Document({
    font: require('pdfjs/font/Helvetica'),
    padding: 30,
    properties: {
      author: 'Indiartcare',
      creationDate: new Date()
    }
  });
  const footer = doc.footer()
  footer.text('If you have any questions about this invoice, please contact [Naveen Nain, 7503731806, naveenkmr129@gmail.com]',{textAlign: "center", fontSize: tableItemBoldFontStyle.fontSize})
  footer.text('Thank You For Your Business !',{textAlign: "center", font: boldFontStyle.font,fontSize: 10} )
  blankSpace(doc, 0.1)

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

    let isIGSTTax = 0;
    let creditItems = [];
    let allItems = [];

    for (let [index, invoice] of invoices.entries()) {
      isIGSTTax = invoice.items[0].taxes.igst;
      allItems = invoice.items
    }

    let taxAmount;
    for (var i = 0; i < creditItems.length; i++) {
      for (var j = 0; j < allItems.length; j++) {
        if (creditItems[i].sellerPrdId === allItems[j].sellerPrdId) {
          if (creditItems[i].qty - allItems[j].qty === 0) {
            allItems.splice(j, 1)
          }
          else {
            allItems[j].qty = allItems[j].qty - creditItems[i].qty
            const qty = allItems[j].qty
            allItems[j].netAmount = qty * allItems[j].unitPrice
            const netAmount = allItems[j].netAmount;

            if (isIGSTTax) {
              const igstRate = allItems[j].taxes.igst.rate
              const igstCharge = netAmount * igstRate / 100;
              allItems[j].taxes.igst.charge = igstCharge
              taxAmount = igstCharge;
            }
            else {
              const cgstRate = allItems[j].taxes.cgst.rate
              const sgstRate = allItems[j].taxes.sgst.rate
              const cgstCharge = netAmount * cgstRate / 100;
              const sgstCharge = netAmount * sgstRate / 100;
              allItems[j].taxes.cgst.charge = cgstCharge
              allItems[j].taxes.sgst.charge = sgstCharge
              taxAmount = cgstCharge + sgstCharge;
            }


            if (allItems[j].taxes.cess) {
              allItems[j].total = netAmount + taxAmount + allItems[j].taxes.cess.charge
            }
            else {
              allItems[j].total = netAmount + taxAmount
            }
          }
        }
      }
    }

    let invoice;
    for (let [index, entry] of invoices.entries()) {
        entry.items = allItems
        invoice = entry;
    }

    let finalNetAmount = 0;
    let finalTax = 0;
    let finalTotalAmount = 0;
    for (let x of allItems) {
      finalNetAmount += x.netAmount
      if (isIGSTTax) {
        finalTax += x.taxes.igst.charge;
      }
      else {
        finalTax += x.taxes.cgst.charge + x.taxes.sgst.charge;
      }
      finalTotalAmount += x.total
    }
    invoice.subtotal = finalNetAmount
    invoice.totalTax = finalTax
    invoice.invoiceTotal = finalTotalAmount
    await createPDF(doc, invoice, null, isSummary = false);
    await doc.end();

}

// Fonts
const normalFontStyle = { fontSize: 8, font: require('pdfjs/font/Helvetica') };
const boldFontStyle = { fontSize: 8, font: require('pdfjs/font/Helvetica-Bold') };
const tableItemNormalFontStyle = { fontSize: 7.5, font: require('pdfjs/font/Helvetica') };
const tableItemBoldFontStyle = { fontSize: 7.5, font: require('pdfjs/font/Helvetica-Bold') };

// build pdf for invoice
const createPDF = async (doc, invoice, forBuyer, isSummary) => {
  const isIGSTTax = invoice.items.length === 0 ? true :invoice.items[0].taxes.igst;
  const isCreditNote = invoice.invoiceType === 'CREDIT_NOTE';

  const currencyFont = { fontSize: 12, font: new pdf.Font(fs.readFileSync(path.join(__dirname, '/assets/roboto_bold.ttf'))) };

  const src = fs.readFileSync(path.join(__dirname, '/assets/logo.jpg'));
  const logo = new pdf.Image(src);

  const header = doc.table({ widths: [null, null], paddingBottom: 0.5 * pdf.cm,paddingLeft: 250 }).row();
  header.cell().image(logo, {height: 1 * Number(pdf.cm), align: 'center'});
  // header.cell().text({ textAlign: 'right' })
  //   .add('INVOICE', {
  //     font: boldFontStyle.font,
  //     color: '#ADD8E6',
  //     fontSize: 20
  //   })
  //   .br().add("(Original for Recipient)", normalFontStyle);

  const detailsContainer = doc.table({ widths: [null, null] }).row();

  // Left Side
  const leftContainer = detailsContainer.cell();

  leftContainer.cell().text('INDIARTCARE',{ font: boldFontStyle.font,fontSize: 14, color: '#00264d' });
  blankSpace(leftContainer, 0.1);

  leftContainer.cell().text('invoice.BusinessName', normalFontStyle);
  leftContainer.cell().text('invoice.BusinessAddress', normalFontStyle);
  leftContainer.cell().text('invoice.PhoneNo', normalFontStyle);

  blankSpace(leftContainer);

  horizontalBoldLightText(leftContainer, "Website:", "invoice.websitename");
  blankSpace(leftContainer, 0.1);
  horizontalBoldLightText(leftContainer, "GST No:", 'invoice.GSTIN');

  // Right Side
  const rightContainer = detailsContainer.cell();
  
  if (isValid(invoice.billingAddress)) {
    rightContainer.cell().text('INVOICE',{ font: boldFontStyle.font,fontSize: 20, color: '#00264d' , textAlign: 'right'});
    blankSpace(rightContainer, 0.1);
    horizontalBoldLightText(rightContainer, "Date:", "invoice.invoicedate", false);
    horizontalBoldLightText(rightContainer, "Invoice No:", "invoice.invoiceNo", false, 'ysgy');
    horizontalBoldLightText(rightContainer, "Invoice Due Date:", "invoice.invoiceDueDate", false);
    horizontalBoldLightText(rightContainer, "HSN code:", "invoice.invoiceHSNCode", false);

    // horizontalBoldLightText(rightContainer, "Billing Address", "", false);
    // horizontalBoldLightText(rightContainer, "", invoice.buyerBusinessName, false);
    // horizontalBoldLightText(rightContainer, "", invoice.billingAddress, false);

    // blankSpace(rightContainer, 0.1);
    // horizontalBoldLightText(rightContainer, "State/UT Code:", invoice.billingAddrStateUTCode, false);
    blankSpace(rightContainer, 0.05);
  }

  // if (isValid(invoice.buyerBizBrandName)) {
  //   horizontalBoldLightText(rightContainer, "Brand Name:", invoice.buyerBizBrandName, false);
  //   blankSpace(rightContainer, 0.05);
  // }

  // if (isValid(invoice.shippingAddress)) {
  //   horizontalBoldLightText(rightContainer, "Shipping Address", "", false);
  //   horizontalBoldLightText(rightContainer, "", invoice.buyerBusinessName, false);
  //   horizontalBoldLightText(rightContainer, "", invoice.shippingAddress, false);

  //   // blankSpace(rightContainer, 0.1);
  //   horizontalBoldLightText(rightContainer, "State/UT Code:", invoice.shippingAddrStateUTCode, false);
  //   blankSpace(rightContainer, 0.1);
  // }

  // if (isValid(invoice.buyerGSTIN)) {
  //   horizontalBoldLightText(rightContainer, "GST No:", invoice.buyerGSTIN, false);
  // }

  const detailsContainer2 = doc.table({ widths: [null, null], paddingBottom: 0.3 * pdf.cm }).row();

  const leftContainer2 = detailsContainer2.cell();
  blankSpace(leftContainer2, 0.4);
  leftContainer2.cell().text('BILL TO',{ font: boldFontStyle.font,fontSize: 10, color: '#00264d'});
  blankSpace(leftContainer2, 0.4);

  horizontalBoldLightText(leftContainer2, "Billing Address:", "invoice.BillingAddress");
  horizontalBoldLightText(leftContainer2, "Phone No:", 'invoice.PhoneNnumber');
  horizontalBoldLightText(leftContainer2, "Place of supply/State Code:", 'invoice.stateCode/placeof supply');
  horizontalBoldLightText(leftContainer2, "GSTIN:", 'invoice.GSTIN');
  blankSpace(leftContainer2, 0.1);
  // horizontalBoldLightText(leftContainer2, "Place of supply/State Code:",formattedDate(invoice.orderDate));
  // if (invoice.requestedDeliveryDate) {
  //   const box = leftContainer2.cell({ backgroundColor: 0xffff00, width: 5 * pdf.cm });
  //   horizontalBoldLightText(box, "Requested Delivery Date:", formattedDate(invoice.requestedDeliveryDate));
  // }

  // const rightContainer2 = detailsContainer2.cell();
  // if (!isSummary) {
  //   if (isValid(invoice.placeOfSupply))
  //     horizontalBoldLightText(rightContainer2, "Place of supply:", invoice.placeOfSupply, false);
  //   if (isValid(invoice.placeOfDelivery))
  //   horizontalBoldLightText(rightContainer2, "Place of delivery:", invoice.placeOfDelivery, false);
  // }
  // let inTb;
  // if (isSummary){
  //   inTb = rightContainer2.table({ widths: [null, 6.8 * pdf.cm] });
  // }else{
  //   inTb = rightContainer2.table({ widths: [null, 4.5 * pdf.cm] });
  // }
  // const inTbRow = inTb.row();
  // const _ = inTbRow.cell();
  // const inTbRowRCell = inTbRow.cell({ backgroundColor: 0xffff00 });
  // if (isSummary){
  //   horizontalBoldLightText(inTbRowRCell, "Bill Summary For Invoice No:", invoice.invoiceNo, false);
  // }else{
  //   horizontalBoldLightText(inTbRowRCell, "Invoice No:", invoice.invoiceNo, false);
  // }
  // horizontalBoldLightText(rightContainer2, "Invoice Date:", formattedDate(invoice.invoiceDate),false);
  // Items Table
  const itemsTable = doc.table({
    widths: [0.6 * pdf.cm, null, 1.4  * pdf.cm, 2 * pdf.cm],
    borderHorizontalWidths: (i) => i < 2 ? 0 : 0.1,
    borderHorizontalColor: 0x616161,
    padding: 2

  });

  const th = itemsTable.header({backgroundColor: 0x00264d, color: '#f9f5f5'});
  th.cell('');
  th.cell('Description', {font: boldFontStyle.font, fontSize: 10, textAlign: 'center'});
  th.cell('No.', {font: boldFontStyle.font, fontSize: 10, textAlign: 'center'});
  th.cell('Amount', {font: boldFontStyle.font, fontSize: 10, textAlign: 'center',});
  // th.cell('Description');
  // th.cell('Total Amt(₹)', { textAlign: 'right', paddingRight: 0 });

  // const th = itemsTable.header({backgroundColor: 0x00264d, color: '#f9f5f5'});
  // th.layout = 'noBorders';
  // th.cell('Description', {font: boldFontStyle.font, fontSize: 10, padding: 5, width: '70%'});
  // th.cell('Amount', {font: boldFontStyle.font, fontSize: 10, padding: 5, width: '30%', align: 'right'});

  const addItemRow = (idx, item) => {
    const tr = itemsTable.row(tableItemNormalFontStyle);
    tr.cell(idx.toString());
    tr.cell().text("item.description "+idx, { textAlign: 'left' });
    tr.cell("item.qty "+idx ? item.qty.toFixed(3).toString() : '-', { textAlign: 'right' });
    tr.cell(item.total.toFixed(2), { textAlign: 'right'});
  }

  invoice.items.forEach((item, idx) => {
    addItemRow(idx + 1, item);
  });

  blankSpace(doc, 0.3)

  const billArea = doc.table({ widths: [null, 7 * pdf.cm] }).row();

  const leftSideBillArea = billArea.cell();
  const rightSideBillArea = billArea.cell();

  // Bill
  const billTable = rightSideBillArea.cell().table({
    widths: [null, null],
    borderHorizontalWidths: (i) => i === 7 ? 1 : 0
  });

  const subtotalTR = billTable.row(normalFontStyle);
  subtotalTR.cell('Subtotal', { textAlign: 'left' });
  subtotalTR.cell(formattedAmount(invoice.subtotal, false), { textAlign: 'right', color: isCreditNote && !isSummary? 0xff0000 : 0x000000 });

  const taxable = billTable.row(normalFontStyle);
  taxable.cell('Taxable', { textAlign: 'left' });
  taxable.cell(formattedAmount(invoice.totalTax, false), { textAlign: 'right', color: isCreditNote && !isSummary ? 0xff0000 : 0x000000 });

  const taxRate = billTable.row(normalFontStyle);
  taxRate.cell('Tax Rate', { textAlign: 'left' });
  taxRate.cell(formattedAmount(invoice.totalTax, false), { textAlign: 'right', color: isCreditNote && !isSummary ? 0xff0000 : 0x000000 });

  const taxDue = billTable.row(normalFontStyle);
  taxDue.cell('Tax Due', { textAlign: 'left' });
  taxDue.cell(formattedAmount(invoice.totalTax, false), { textAlign: 'right', color: isCreditNote && !isSummary ? 0xff0000 : 0x000000 });
  
  const sgst = billTable.row(normalFontStyle);
  sgst.cell('SGST', { textAlign: 'left' });
  sgst.cell(formattedAmount(invoice.totalTax, false), { textAlign: 'right', color: isCreditNote && !isSummary ? 0xff0000 : 0x000000 });
  
  const cgst = billTable.row(normalFontStyle);
  cgst.cell('CGST', { textAlign: 'left' });
  cgst.cell(formattedAmount(invoice.totalTax, false), { textAlign: 'right', color: isCreditNote && !isSummary ? 0xff0000 : 0x000000 });
  
  const igst = billTable.row(normalFontStyle);
  igst.cell('IGST', { textAlign: 'left' });
  igst.cell(formattedAmount(invoice.totalTax, false), { textAlign: 'right', color: isCreditNote && !isSummary ? 0xff0000 : 0x000000 });
  
  const invoiceTotalTR = billTable.row(normalFontStyle);
  invoiceTotalTR.cell('Invoice Total', { textAlign: 'left' ,fontSize: 10,font: currencyFont.font});
  invoiceTotalTR.cell(formattedAmount(invoice.invoiceTotal), { textAlign: 'right', font: currencyFont.font, fontSize: 10,backgroundColor: 0xffff00 });

  blankSpace(rightSideBillArea, 0.1);
  rightSideBillArea.cell("invoice.amountInWords", normalFontStyle);
  blankSpace(rightSideBillArea, 0.1);

  // const itemsTable2 = doc.table({
  //   widths: [0.6 * pdf.cm,null],
  //   borderHorizontalWidths: (i) => i < 2 ? 0 : 0.1,
  //   borderHorizontalColor: 0x616161,
  //   padding: 2
  // });

  // const th2 = itemsTable2.header({backgroundColor: 0x00264d, color: '#f9f5f5'});
  // th2.cell('');
  // th2.cell('Description', {font: boldFontStyle.font, fontSize: 10, textAlign: 'center'});
  

  const signatureArea = rightSideBillArea.table({
    widths: [null, null]
  }).row();

  
  

  signatureArea.cell();
  const signTable = signatureArea.cell().table({
    widths: [3 * pdf.cm],
    borderHorizontalWidths: (i) => i === 1 ? 1 : 0
  });

  const digitalSign = null // call if digital signature

  if (digitalSign !== null) {
    try {
      signTable.row().cell().image((new pdf.Image(digitalSign)), { height: 1.2 * pdf.cm, align: 'center' });
    } catch (e) {
      signTable.row().cell({ minHeight: 1 * Number(pdf.cm) });
    }
  } else {
    signTable.row().cell({ minHeight: 1 * Number(pdf.cm) });
  }

  signTable.row().cell();
  signTable.row().cell('(Authorized Sign)', { font: tableItemBoldFontStyle.font, fontSize: tableItemBoldFontStyle.fontSize, textAlign: 'center' });
}

// Helper methods
const horizontalBoldLightText = (container, title, desc, isLeftAligned = true,color) => {
  return container.cell()
    .text({ textAlign: isLeftAligned ? 'left' : 'right'})
    .add(title, boldFontStyle)
    .add(desc, normalFontStyle)
}

const blankSpace = (doc, height = 0.2) => doc.cell({ paddingBottom: height * pdf.cm });

const isValid = (value) => value && value.length !== 0;

const formattedAmount = (amount, showCurrency = true) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  });

  return showCurrency ? formatter.format(amount) : formatter.format(amount).substring(1);
}

const formattedDate = (date) =>(new Date(date.seconds * 1000)).toLocaleDateString("en-GB", {timeZone: 'Asia/Kolkata'});
