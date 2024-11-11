import React, { useEffect } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { fetchRecentDoc } from '../store/generatedDocSlice';
import { useDispatch, useSelector } from 'react-redux';

const RecentDocuments = () => {
    const { token } = useSelector((state) => state.auth);
    const { recent, loading, error, currentPage, totalPages } = useSelector((state) => state.document);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRecentDoc({ token }));
    }, [dispatch, token]);

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-bold text-black">Recent documents</h5>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recent.map((doc, index) => (
                    <Card key={index} className="shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                        <CardContent>
                            <Typography variant="h6" component="h2" className="truncate">
                                {doc.format}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className="mt-2">
                                {doc.content}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RecentDocuments;
