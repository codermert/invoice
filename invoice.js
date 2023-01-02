var https   = require("https");
var fs      = require("fs");

function generateInvoice(invoice, filename, success, error) {
    var postData = JSON.stringify(invoice);
    var options = {
        hostname  : "invoice-generator.com",
        port      : 443,
        path      : "/",
        method    : "POST",
        headers   : {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
        }
    };

    var file = fs.createWriteStream(filename);

    var req = https.request(options, function(res) {
        res.on('data', function(chunk) {
            file.write(chunk);
        })
        .on('end', function() {
            file.end();

            if (typeof success === 'function') {
                success();
            }
        });
    });
    req.write(postData);
    req.end();

    if (typeof error === 'function') {
        req.on('error', error);
    }
}

var invoice = {
    logo: "https://www.pngall.com/wp-content/uploads/12/Ticket-No-Background.png",
    header: "FATURA",
    balance_title: "TOPLAM",
    to_title: "Ad & Soyad",
    date_title: "Oluşturulma",
    payment_terms_title: "Durum",
    item_header: "Ürün",
    unit_cost_header: "Fiyat",
    quantity_header: "Adet",
    amount_header: "Tutar",
    subtotal_title: "Ara toplam",
    tax_title: "Vergi",
    total_title: "Toplam",
    notes_title: "NOT",
    terms_title: "DUYURU",
    from: "TARİH - ADRES \n28 Ocak Cumartesi, 20:00\nCahit Sıtkı Tarancı K.M Orhan Asena Sahnesi",
    to: "Ludmila Hanzlíková",
    currency: "try",
    number: "",
    payment_terms: "ÖDENDİ",
    items: [
        {
            name: "TAM BİLET",
            quantity: 1,
            unit_cost: 138
        }
    ],
    fields: {
        tax: "%"
    },
    tax: 8,
    notes: "Harika bir müşteri olduğunuz için teşekkürler!",
    terms: "Eğer biletiniz bir elektronik bilet ise hiç korkmayın biz size yardımcı olabiliriz. Kaybettiğiniz bilet fiziki olarak satın aldığınız bilet ise biletin tekrar yazdırılması teknik olarak mümkün değildir. Bu nedenle satın aldığınız bileti saklamak ve korumak tamamen sizin sorumluluğunuzdadır.\n\nOrganizasyon sahibi olmadığı ve yalnızca etkinlik biletlemesinden sorumlu olduğu için mevcut organizasyonla ilgili herhangi bir iptal ya da değişiklik olmadığı sürece ya da organizasyon sahibinin açıkladığı kurallar dışında satın alınan biletlerde herhangi bir değişiklik ya da iade yapma hakkına sahip değildir."
};

generateInvoice(invoice, 'invoice.pdf', function() {
    console.log("Saved invoice to invoice.pdf");
}, function(error) {
    console.error(error);
});
