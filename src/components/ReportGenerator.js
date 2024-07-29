import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CreditCardIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import { generateReport, validateToken } from '../services/apiLabzService';
import { getBoardData } from '../services/trelloService';

const ReportGenerator = ({ token, credits, setCredits }) => {
    const [instructions, setInstructions] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportUrl, setReportUrl] = useState('');
    const [reportType, setReportType] = useState(null);

    const handleGenerateReport = async (type) => {
        setIsGenerating(true);
        setReportUrl('');
        setReportType(type);

        try {
            const t = window.TrelloPowerUp.iframe();
            const boardData = await getBoardData(t);
            const report = await generateReport(token, type, boardData, instructions);
            
            if (type === 'text') {
                const blob = new Blob([report[0].text], { type: 'text/html' });
                setReportUrl(URL.createObjectURL(blob));
            } else {
                setReportUrl(report.fileURL);
            }

            const updatedCredits = await validateToken(token);
            if (updatedCredits.isValid) {
                setCredits(updatedCredits.credits);
            } else {
                throw new Error('Token became invalid');
            }
            
            toast.success('Report generated successfully!');
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('An error occurred while generating the report. Please try again.');
            setReportType(null);
        }
        setIsGenerating(false);
    };

    const handleDownload = () => {
        window.open(reportUrl, '_blank');
    };

    return (
        <div className="bg-white p-4">
            <div className="flex items-center mb-4">
                <CreditCardIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-semibold">Credits: {credits}</span>
            </div>
            <div className="mb-4">
                <textarea
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter your instructions here"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                ></textarea>
            </div>
            <div className="space-y-2">
                {isGenerating ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Generating {reportType} report...</p>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => handleGenerateReport('text')}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm"
                        >
                            <DocumentTextIcon className="h-4 w-4 mr-2" />
                            Generate Text Report
                        </button>
                        <button
                            onClick={() => handleGenerateReport('graphic')}
                            className="w-full bg-green-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm"
                        >
                            <ChartBarIcon className="h-4 w-4 mr-2" />
                            Generate Graphic Report
                        </button>
                    </>
                )}
            </div>
            {reportUrl && !isGenerating && (
                <div className="mt-4 bg-gray-100 p-3 rounded-md">
                    <button
                        onClick={handleDownload}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                    >
                        Download Report
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReportGenerator;