function doit() {
    // const pdf = new jsPDF('1', 'pt', 'a4');
    // // pdf.addHTML(document.getElementById('c797'), 0, 0, {rstz: false}, function () {
    // //     pdf.save('Test.pdf');
    // // });
    //
    //
    // pdf.html(document.getElementById('c797'), {
    //     html2canvas,
    //     callback: (doc) => doc.save('filename.pdf'),
    // });

    simulatePrintMedia();
    var element = document.getElementById('c797');
    html2pdf(element, {enableLinks: true})
        .then(restoreScreenMedia);
}