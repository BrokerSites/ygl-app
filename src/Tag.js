import React from 'react';
import { Badge } from 'react-bootstrap';

const Tag = ({ text, onRemove }) => {
    return (
        <Badge pill bg="primary" className="me-2">
            {text}
            <span onClick={() => onRemove(text)} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                &times;
            </span>
        </Badge>
    );
};

export default Tag;
