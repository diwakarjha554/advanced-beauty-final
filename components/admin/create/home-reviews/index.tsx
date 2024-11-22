'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2Icon, EditIcon, TrashIcon, UploadIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { createReview, updateReview, deleteReview, fetchReviews, Review } from '@/actions/admin/review/review.actions';
import { uploadImageToDrive } from '@/actions/google-drive-upload/googleDriveUpload.actions';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ApiResponse {
    success: boolean;
    review?: Review;
    reviews?: Review[];
    error?: string;
}

const HomeReviewsManagement = () => {
    const [name, setName] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState({
        create: false,
        delete: '',
        edit: false,
        upload: false,
        fetch: true,
    });
    const itemsPerPage = 10;
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadReviews = async () => {
            setIsLoading((prev) => ({ ...prev, fetch: true }));
            try {
                const result = await fetchReviews();
                if (result.success && result.reviews) {
                    setReviews(result.reviews);
                }
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch reviews');
            } finally {
                setIsLoading((prev) => ({ ...prev, fetch: false }));
            }
        };
        loadReviews();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setIsLoading((prev) => ({ ...prev, upload: true }));

        try {
            const result = await uploadImageToDrive(file);
            if (result.success && result.url) {
                setImageSrc(result.url);
                toast.success('Image uploaded successfully');
            } else {
                toast.error(result.error || 'Image upload failed');
            }
        } catch (error) {
            console.log(error);
            toast.error('Image upload failed');
        } finally {
            setIsLoading((prev) => ({ ...prev, upload: false }));
        }
    };

    const handleSubmit = async () => {
        if (!name.trim() || !reviewText.trim() || !imageSrc) {
            toast.error('Please fill all fields');
            return;
        }

        setIsLoading((prev) => ({ ...prev, create: true }));

        try {
            const reviewData = {
                name,
                reviewText,
                imageSrc,
            };

            let result: ApiResponse;
            if (editingReview) {
                result = await updateReview(editingReview.id, reviewData);
                if (result.success) {
                    setReviews((prev) =>
                        prev.map((rev) => (rev.id === editingReview.id ? { ...rev, ...reviewData } : rev))
                    );
                    toast.success('Review updated successfully');
                    setEditingReview(null);
                } else {
                    toast.error('Failed to update review');
                }
            } else {
                result = await createReview(reviewData);
                if (result.success && result.review) {
                    setReviews((prev) => [result.review!, ...prev]);
                    toast.success('Review created successfully');
                } else {
                    toast.error('Failed to create review');
                }
            }

            // Reset form
            setName('');
            setReviewText('');
            setImageSrc('');
            setImagePreview(null);
        } catch (error) {
            console.log(error);
            toast.error('An error occurred');
        } finally {
            setIsLoading((prev) => ({ ...prev, create: false }));
        }
    };

    const handleEdit = (review: Review) => {
        setEditingReview(review);
        setName(review.name);
        setReviewText(review.reviewText);
        setImageSrc(review.imageSrc);
        setImagePreview(review.imageSrc);
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setName('');
        setReviewText('');
        setImageSrc('');
        setImagePreview(null);
    };

    const handleDelete = async (id: string) => {
        setIsLoading((prev) => ({ ...prev, delete: id }));
        try {
            const result = await deleteReview(id);
            if (result.success) {
                setReviews(reviews.filter((rev) => rev.id !== id));
                toast.success('Review deleted successfully');
            } else {
                toast.error('Failed to delete review');
            }
        } catch (error) {
            console.log(error);
            toast.error('An error occurred');
        } finally {
            setIsLoading((prev) => ({ ...prev, delete: '' }));
        }
    };

    // Pagination & Search Logic
    const filteredReviews = reviews.filter((review) => review.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const paginatedReviews = filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

    return (
        <div className="w-full p-6 space-y-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{editingReview ? 'Edit' : 'Create'} Review</CardTitle>
                    <CardDescription>
                        {editingReview ? 'Modify' : 'Add'} a review with name, text, and image
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input placeholder="Reviewer Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Textarea
                            placeholder="Review Text"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading.upload}
                            >
                                {isLoading.upload ? (
                                    <Loader2Icon className="mr-2 animate-spin" />
                                ) : (
                                    <UploadIcon className="mr-2" />
                                )}
                                Upload Image
                            </Button>
                            {imagePreview && (
                                <div className="mt-4 flex flex-col items-center">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        width={1000}
                                        height={1000}
                                        className="max-h-48 object-cover"
                                    />
                                    <p className="mt-2 text-sm text-gray-500 break-words max-w-full">{imageSrc}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex space-x-2">
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={!name || !reviewText || !imageSrc || isLoading.create}
                    >
                        {isLoading.create ? (
                            <Loader2Icon className="mr-2 animate-spin" />
                        ) : editingReview ? (
                            'Update Review'
                        ) : (
                            'Create Review'
                        )}
                    </Button>
                    {editingReview && (
                        <Button variant="outline" onClick={handleCancelEdit}>
                            <XIcon className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>List of existing reviews</CardDescription>
                    <div className="mt-4">
                        <Input
                            placeholder="Search reviews..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading.fetch ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2Icon className="animate-spin w-10 h-10" />
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/6">Image</TableHead>
                                        <TableHead className="w-1/4">Name</TableHead>
                                        <TableHead className="w-1/3">Review Text</TableHead>
                                        <TableHead className="w-1/6">Created At</TableHead>
                                        <TableHead className="w-1/6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedReviews.map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell>
                                                <Image
                                                    src={review.imageSrc}
                                                    alt={review.name}
                                                    width={1000}
                                                    height={1000}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            </TableCell>
                                            <TableCell>{review.name}</TableCell>
                                            <TableCell>{review.reviewText}</TableCell>
                                            <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleEdit(review)}
                                                    disabled={isLoading.edit}
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDelete(review.id)}
                                                    disabled={isLoading.delete === review.id}
                                                >
                                                    {isLoading.delete === review.id ? (
                                                        <Loader2Icon className="animate-spin h-4 w-4" />
                                                    ) : (
                                                        <TrashIcon className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {/* Pagination Controls */}
                            <div className="flex justify-between items-center mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
                                </Button>
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next <ChevronRightIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default HomeReviewsManagement;
