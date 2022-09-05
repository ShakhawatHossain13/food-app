import React, { useEffect, useState } from 'react'
import './pagination.css';

const Pagination = (props:any) => {

    const { totalData, setPage, itemPerPage } = props;

    const [pageNumber, setPageNumber] = useState(0);
    const [button, setButton] = useState([]);

    useEffect(() => {
        setPageNumber(Math.ceil(totalData / itemPerPage));
    }, [totalData]);

    useEffect(() => {
        let btn:any = [];
        for (let i = 0; i < pageNumber; i++) {
            btn.push({ id: i });
        }
        setButton(btn);

    }, [pageNumber]);


    let paginationBar = button.map((_, index) => {
        return <button
            key={index}
            onClick={() => setPage(index + 1)}>
            {index + 1}

        </button>
    })

    return (
        <div className="pagination">
            {paginationBar}
        </div>
    )

}

export default Pagination;