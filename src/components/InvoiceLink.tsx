export interface InvoiceLinkProps {
    invoiceNo: string;
}

const InvoiceLink = ({invoiceNo}:InvoiceLinkProps) => {
    const url = `/reports/account/invoice/?company=CHI&invoice=${invoiceNo}`;
    return (<a href={url} target="_blank">{invoiceNo}</a>)
}

export default InvoiceLink;
