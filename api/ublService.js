// Add this to a new file: services/ublService.js
const xmlbuilder = require('xmlbuilder');
// const xml2js = require('xml2js');
// const { DOMParser } = require('xmldom');
const libxmljs = require('libxmljs');
const fs = require('fs');
const path = require('path');

// Path to UBL 2.1 Invoice schema (you'll need to download this)
const UBL_SCHEMA_PATH = path.join(__dirname, '../schemas/UBL-Invoice-2.1.xsd');

// Convert your invoice to UBL XML format
function convertInvoiceToUBL(invoice) {
  // Create the root element with all necessary namespaces
  const root = xmlbuilder.create('Invoice', { version: '1.0', encoding: 'UTF-8' })
    .att('xmlns', 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2')
    .att('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
    .att('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2');

  // Add UBL version info
  root.ele('cbc:UBLVersionID', '2.1');
  root.ele('cbc:CustomizationID', 'urn:cen.eu:en16931:2017');
  root.ele('cbc:ID', invoice.invoiceNumber);
  root.ele('cbc:IssueDate', new Date(invoice.issueDate).toISOString().split('T')[0]);
  root.ele('cbc:DueDate', new Date(invoice.dueDate).toISOString().split('T')[0]);
  root.ele('cbc:InvoiceTypeCode', 380);
  
  // Add currency code - assuming USD
  root.ele('cbc:DocumentCurrencyCode', 'USD');

  // Add supplier party information
  const supplierParty = root.ele('cac:AccountingSupplierParty')
    .ele('cac:Party');
  
  const supplierPartyName = supplierParty.ele('cac:PartyName');
  supplierPartyName.ele('cbc:Name', 'Your Company Name'); // Replace with your own data
  
  // Add customer party information
  const customerParty = root.ele('cac:AccountingCustomerParty')
    .ele('cac:Party');
  
  const customerPartyName = customerParty.ele('cac:PartyName');
  customerPartyName.ele('cbc:Name', invoice.client.name);
  
  // Add line items
  invoice.items.forEach((item, index) => {
    const invoiceLine = root.ele('cac:InvoiceLine');
    invoiceLine.ele('cbc:ID', index + 1);
    invoiceLine.ele('cbc:InvoicedQuantity', item.quantity)
      .att('unitCode', 'EA'); // EA = Each, replace with appropriate unit
    
    invoiceLine.ele('cbc:LineExtensionAmount', item.total)
      .att('currencyID', 'USD');
    
    // Item details
    const itemElement = invoiceLine.ele('cac:Item');
    itemElement.ele('cbc:Description', item.description);
    itemElement.ele('cbc:Name', item.description);
    
    // Price
    const price = invoiceLine.ele('cac:Price');
    price.ele('cbc:PriceAmount', item.unitPrice)
      .att('currencyID', 'USD');
  });
  
  // Add monetary totals
  const legalMonetaryTotal = root.ele('cac:LegalMonetaryTotal');
  legalMonetaryTotal.ele('cbc:LineExtensionAmount', invoice.subtotal)
    .att('currencyID', 'USD');
  legalMonetaryTotal.ele('cbc:TaxExclusiveAmount', invoice.subtotal)
    .att('currencyID', 'USD');
  legalMonetaryTotal.ele('cbc:TaxInclusiveAmount', invoice.total)
    .att('currencyID', 'USD');
  legalMonetaryTotal.ele('cbc:PrepaidAmount', 0)
    .att('currencyID', 'USD');
  legalMonetaryTotal.ele('cbc:PayableAmount', invoice.total)
    .att('currencyID', 'USD');
    
  // Return as XML string
  return root.end({ pretty: true });
}

// Validate XML against UBL schema
async function validateUBL(xmlString) {
  try {
    // Load the XSD schema
    const schemaContent = fs.readFileSync(UBL_SCHEMA_PATH, 'utf8');
    const schema = libxmljs.parseXml(schemaContent);
    
    // Parse the XML
    const xml = libxmljs.parseXml(xmlString);
    
    // Validate against schema
    const isValid = xml.validate(schema);
    
    if (isValid) {
      return { isValid: true };
    } else {
      return { 
        isValid: false, 
        errors: xml.validationErrors.map(error => error.message)
      };
    }
  } catch (error) {
    return { 
      isValid: false, 
      errors: [`XML validation error: ${error.message}`] 
    };
  }
}


