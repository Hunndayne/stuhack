const coverPageHtml = `
<div class="cover-page" style="page-break-after: always; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Roboto', sans-serif; background-color: #f0f2f5;">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    
    <div class="content-wrapper" style="text-align: center; background-color: white; padding: 40px 50px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <h1 style="font-size: 2em; color: #1a1a1a; margin-top: 0; margin-bottom: 20px; font-weight: 700; line-height: 1.4;">
            DOWNLOADED WITH STUDOHACK<br>MODDED BY HUNN
        </h1>
        <div class="links" style="margin-top: 10px;">
            <a href="https://facebook.com/hunnisme" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none; margin: 0 15px; font-size: 1.1em; transition: color 0.3s ease;">facebook.com/hunnisme</a>
            <a href="https://github.com/Hunndayne" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none; margin: 0 15px; font-size: 1.1em; transition: color 0.3s ease;">github.com/Hunndayne</a>
        </div>
    </div>
</div>
`;

function downloadFromCache(cachedHtml, title) {
    console.log(`StuHack: Start save ${cachedHtml.length} into cache.`);

    const head = document.getElementsByTagName("head")[0].innerHTML;
    
    // Mở cửa sổ mới
    const newWindow = window.open("", title);
    if (!newWindow) {
        alert("Vui lòng cho phép pop-up để tải tài liệu.");
        return;
    }
    newWindow.document.title = title;

    // Nạp CSS gốc và thêm luật CSS để sửa lỗi hiển thị
    newWindow.document.head.innerHTML = head + `
        <style>
            body { overflow: visible !important; }
            .Viewer_page-container__shmQ1, .p2hv { 
                opacity: 1 !important; 
                position: static !important;
                display: block !important;
                transform: none !important;
                width: auto !important;
                height: auto !important;
            }
            .pf {
                margin: 20px auto;
            }
            @media print {
                @page { size: auto; }
                .pf { margin: 0; box-shadow: none; }
            }
        </style>
    `;


    const fullHtmlContent = coverPageHtml +''+ cachedHtml.join('');
    newWindow.document.body.innerHTML = `
        <div id="page-container-wrapper" class="p2hv Viewer_page-container__shmQ1">
            <div id="page-container">
                ${fullHtmlContent} 
            </div>
        </div>
    `;
    
    console.log("StuHack: Create full page from cache successfully.");


    setTimeout(() => {
        newWindow.focus();
        newWindow.print();
    }, 1500);
}


async function prepareAndDownload() {
    const pageHtmlCache = [];
    const title = document.querySelector("h1.DocumentViewerSidebar_document-title__BRO_Z")?.innerText || "Studocu Document";

    const overlay = document.createElement('div');
    overlay.id = 'stuhack-loader-overlay';
    Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: '9999', display: 'flex',
        justifyContent: 'center', alignItems: 'center', color: 'white',
        fontSize: '24px', fontFamily: 'sans-serif', textAlign: 'center'
    });
    document.body.appendChild(overlay);

    console.log("StuHack: Auto roll and save to cache.");
    const pages = document.querySelectorAll('div[data-page-index]');
    const totalPages = pages.length;

    for (let i = 0; i < totalPages; i++) {
        const pageElement = pages[i];
        pageElement.scrollIntoView({ block: 'center' });
        overlay.innerHTML = `Đang chạy và lưu trang ${i + 1} / ${totalPages}...`;
        await new Promise(resolve => setTimeout(resolve, 250)); 

        const pageContentContainer = pageElement.querySelector('.pf');
        if (pageContentContainer) {
            pageHtmlCache.push(pageContentContainer.outerHTML);
            console.log(`StuHack: Save HTML Page ${i + 1}`);
        } else {
            console.warn(`StuHack: Cannot find content from page ${i + 1}`);
        }
    }
    
    console.log(`StuHack: Scan succesfully, saved ${pageHtmlCache.length} page(s).`);
    overlay.innerHTML = "Đã thu thập xong! Đang dựng tài liệu, chờ xíu nha.";
    await new Promise(resolve => setTimeout(resolve, 1000));

    downloadFromCache(pageHtmlCache, title);
    document.body.removeChild(overlay);
}

function addButtons() {
    const actionBarSelector = '.DocumentViewerActionBar_main-container__91Hib';
    const actionBar = document.querySelector(actionBarSelector);
    if (!actionBar || actionBar.querySelector('.stuhack-download-button')) return;

    const button = document.createElement("button");
    button.className = "stuhack-download-button";
    button.innerHTML = '<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="width: 20px; height: 20px; margin-right: 8px;"><path fill="currentColor" d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zm-132.9 88.7L299.3 420.7c-6.2 6.2-16.4 6.2-22.6 0L171.3 315.3c-10.1-10.1-2.9-27.3 11.3-27.3H248V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v112h65.4c14.2 0 21.4 17.2 11.3 27.3z"></path></svg><span class="download-text">Download Full</span>';
    
    Object.assign(button.style, {
        backgroundColor: '#007BFF', color: 'white', padding: '10px 15px', border: 'none',
        borderRadius: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center',
        fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'bold'
    });

    button.onclick = prepareAndDownload;
    actionBar.prepend(button);
}

const observer = new MutationObserver(addButtons);
window.addEventListener('load', function() {
    setTimeout(addButtons, 1500);
    observer.observe(document.body, { childList: true, subtree: true });
});