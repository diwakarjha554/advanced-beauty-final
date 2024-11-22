'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2Icon, EditIcon, TrashIcon, UploadIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
    createServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
    fetchServiceCategories,
    ServiceCategory,
} from '@/actions/admin/service/service-category.actions';
import { uploadImageToDrive } from '@/actions/google-drive-upload/googleDriveUpload.actions';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ApiResponse {
    success: boolean;
    category?: ServiceCategory;
    categories?: ServiceCategory[];
    error?: string;
}

const ServiceCategoryManagement = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
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
        const loadCategories = async () => {
            setIsLoading((prev) => ({ ...prev, fetch: true }));
            try {
                const result = await fetchServiceCategories();
                if (result.success && result.categories) {
                    setCategories(result.categories);
                }
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch categories');
            } finally {
                setIsLoading((prev) => ({ ...prev, fetch: false }));
            }
        };
        loadCategories();
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
        if (!title.trim() || !description.trim() || !imageSrc) {
            toast.error('Please fill all fields');
            return;
        }

        setIsLoading((prev) => ({ ...prev, create: true }));

        try {
            const lowerCaseTitle = title.toLowerCase();
            const categoryData = { 
                title: lowerCaseTitle, 
                description: description, 
                imageSrc 
            };

            let result: ApiResponse;
            if (editingCategory) {
                result = await updateServiceCategory(editingCategory.id, categoryData);
                if (result.success) {
                    setCategories((prev) =>
                        prev.map((cat) => (cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat))
                    );
                    toast.success('Category updated successfully');
                    setEditingCategory(null);
                } else {
                    toast.error('Failed to update category');
                }
            } else {
                result = await createServiceCategory(categoryData);
                if (result.success && result.category) {
                    setCategories((prev) => [result.category!, ...prev]);
                    toast.success('Category created successfully');
                } else {
                    toast.error('Failed to create category');
                }
            }

            // Reset form
            setTitle('');
            setDescription('');
            setImageSrc('');
            setImagePreview(null);
        } catch (error) {
            console.log(error);
            toast.error('An error occurred');
        } finally {
            setIsLoading((prev) => ({ ...prev, create: false }));
        }
    };

    const handleEdit = (category: ServiceCategory) => {
        setEditingCategory(category);
        setTitle(category.title);
        setDescription(category.description);
        setImageSrc(category.imageSrc);
        setImagePreview(category.imageSrc);
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setTitle('');
        setDescription('');
        setImageSrc('');
        setImagePreview(null);
    };

    const handleDelete = async (id: string) => {
        setIsLoading((prev) => ({ ...prev, delete: id }));
        try {
            const result = await deleteServiceCategory(id);
            if (result.success) {
                setCategories(categories.filter((cat) => cat.id !== id));
                toast.success('Category deleted successfully');
            } else {
                toast.error('Failed to delete category');
            }
        } catch (error) {
            console.log(error);
            toast.error('An error occurred');
        } finally {
            setIsLoading((prev) => ({ ...prev, delete: '' }));
        }
    };

    // Pagination & Search Logic
    const filteredCategories = categories.filter((category) =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    return (
        <div className="w-full p-6 space-y-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{editingCategory ? 'Edit' : 'Create'} Service Category</CardTitle>
                    <CardDescription>
                        {editingCategory ? 'Modify' : 'Add'} a service category with title, description, and image
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input placeholder="Category Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                        <Textarea
                            placeholder="Category Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                        disabled={!title || !description || !imageSrc || isLoading.create}
                    >
                        {isLoading.create ? (
                            <Loader2Icon className="mr-2 animate-spin" />
                        ) : editingCategory ? (
                            'Update Category'
                        ) : (
                            'Create Category'
                        )}
                    </Button>
                    {editingCategory && (
                        <Button variant="outline" onClick={handleCancelEdit}>
                            <XIcon className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Service Categories</CardTitle>
                    <CardDescription>List of existing service categories</CardDescription>
                    <div className="mt-4">
                        <Input
                            placeholder="Search categories..."
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
                                        <TableHead className="w-1/4">Title</TableHead>
                                        <TableHead className="w-1/3">Description</TableHead>
                                        <TableHead className="w-1/6">Created At</TableHead>
                                        <TableHead className="w-1/6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>
                                                <Image
                                                    src={category.imageSrc}
                                                    alt={category.title}
                                                    width={1000}
                                                    height={1000}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            </TableCell>
                                            <TableCell>{category.title}</TableCell>
                                            <TableCell>{category.description}</TableCell>
                                            <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleEdit(category)}
                                                    disabled={isLoading.edit}
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            disabled={isLoading.delete === category.id}
                                                        >
                                                            {isLoading.delete === category.id ? (
                                                                <Loader2Icon className="animate-spin h-4 w-4" />
                                                            ) : (
                                                                <TrashIcon className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete the service category.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(category.id)}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
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

export default ServiceCategoryManagement;