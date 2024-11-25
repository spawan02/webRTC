import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Page, pdfjs, Document } from "react-pdf";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;



export const MyPdfViewer = () => {
    const [file, setFile] = useState<ArrayBuffer | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState<number | null>(null);
    useEffect(()=>{
        console.log("inside the useEffect");
        
        const fetchData =async()=>{
            const response = await axios.get("http://localhost:8080/doc",{

                headers:{
                    'Content-type': 'application/pdf'
                },
                responseType:'arraybuffer'
            })
            
            const arrayBuffer = await response.data as ArrayBuffer
            
            setFile(arrayBuffer) 
        }
        fetchData()
    },[])
    
    // const handleFileChange = (e: any) => {
    //     const uploadedFile = e.target.files[0];
    //     if (uploadedFile && uploadedFile.type === "application/pdf") {
    //         setFile(URL.createObjectURL(uploadedFile)); // Create a URL for the uploaded file
    //     } else {
    //         alert("Please upload a valid PDF file.");
    //     }
    //     console.log(URL.createObjectURL(uploadedFile));
    // };
    const onDocumentLoad = ({ numPages }: any) => {
        console.log("inside the onDocument ");
        
        setNumPages(numPages);
        setPageNumber(1);
    };

    const onNextPage = () => {
        setPageNumber((pageNumber) => Math.min(pageNumber + 1, numPages!));
    };
    const onPrevPage = () => {
        setPageNumber((pageNumber) => Math.max(pageNumber - 1, 1));
    };

    return (
        <div>
            <h1> This is the pdf viewer</h1>
            <input
                type="file"
                accept="application/pdf"
                // onChange={handleFileChange}
                className="flex justify-center"
            />
            {file && (
                <div>
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoad}
                        className="flex justify-center"
                    >
                        <Page 
                            pageNumber={pageNumber} 
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            className="max-w-full"
                        />
                    </Document>
                    <div>
                        <button onClick={onPrevPage} disabled={pageNumber <= 1}>
                            <ChevronLeft className="w-3 h-3"/>
                        </button>
                        <span>
                            Page {pageNumber} of {numPages}
                        </span>
                        
                        <button
                            onClick={onNextPage}
                            disabled={pageNumber >= numPages!}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-3 h-3 t" />
                        </button>
                    </div>
                </div>
            )}
            {!file && <p>please upload a file to view it here</p>}
        </div>
    );
};

const PDFView = () => {
    return (
        // <div className="max-w-[90%] mx-auto bg-black p-8 rounded-3xl shadow-2xl">
        //     <div className="aspect-video bg-white rounded-lg overflow-hidden">
        //         {/* <PDFViewer url={pdf_url} className="w-full h-full" /> */}
        //     </div>
        // </div>
                <MyPdfViewer />
    );
};
export default PDFView;
