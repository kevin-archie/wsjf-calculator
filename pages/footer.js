import React from 'react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer style={{
            position: 'relative',
            bottom: '0',
            width: '100%',
            background: 'rgb(255, 180, 0)', // Adjusted color to a bit orange
            color: '#FFFFFF', // White color for the text
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'Helvetica Neue, Verdana, sans-serif' // Change this to a more professional font
        }}>
            <p><b>Weighted Shortest Job First</b> is a prioritisation technique that helps teams to prioritise their
                work based on the cost of delay.</p>
            <p>For more details see these great articles at <a
                href="https://www.productplan.com/glossary/weighted-shortest-job-first/#:~:text=How%20is%20WSJF%20calculated%3F,Job%20Duration%20(or%20Size)"
                style={{color: '#222222'}}>ProductPlan</a> and <a href="https://scaledagileframework.com/wsjf/"
                                                                  style={{color: '#222222'}}>SAFe</a>.
            </p>
            <p>&copy; {year} <a href="https://sprout.co.id/id" style={{color: '#222222'}}>Sprout</a></p>
            <p style={{textAlign: 'center'}}>
                Built with
                <img src="/next-js.svg" alt="NextJS"
                     style={{height: '20px', marginLeft: '10px', marginRight: '10px'}}/>
                <span style={{marginLeft: '10px', marginRight: '10px'}}>☕</span>
                <span style={{marginLeft: '10px', marginRight: '10px'}}>🚬</span>
                by <a href="https://github.com/kevin-archie">Kevin Archie</a>
            </p>
        </footer>
    );
};

export default Footer;