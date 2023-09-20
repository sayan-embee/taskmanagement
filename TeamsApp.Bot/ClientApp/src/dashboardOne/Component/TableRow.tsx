import React, { useState } from 'react'

function TableRow({children, cells, cellsBefore }: any) {
    const [expanded, setExpanded] = useState(false);
    const toggleExapanded = () => {
        setExpanded((prev) => !prev);
    }

    return (
        <>
            <tr className='nestedTableRow' onClick={() => { toggleExapanded() }} style={{ cursor: "pointer" }}>
                {cellsBefore}
                <td style={{ width: "1%" }}>{expanded ? <span style={{ color: "red" }}>-</span> : <span style={{ color: "green" }}>+</span>}</td>
                {cells}
            </tr>
            {expanded && children}
        </>
    )
}

export default TableRow