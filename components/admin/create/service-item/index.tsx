'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { uploadImageToDrive } from '@/actions/google-drive-upload/googleDriveUpload.actions';
import { fetchServiceCategories, ServiceCategory } from '@/actions/admin/service/service-category.actions';
import toast from 'react-hot-toast';
import Image from 'next/image';
import {
    createServiceItem,
    deleteServiceItem,
    fetchServiceItems,
    ServiceItem,
    updateServiceItem,
} from '@/actions/admin/service/service-item.actions';

interface Service {
    id: string;
    imageSrc: string;
    category: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    otherInfo?: Record<string, string>;
}

interface ApiResponse {
    success: boolean;
    item?: ServiceItem;
    items?: ServiceItem[];
    error?: string;
}

const ServiceItemManagement = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [otherInfo, setOtherInfo] = useState('');
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [editingService, setEditingService] = useState<Service | null>(null);
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
        const loadData = async () => {
            setIsLoading((prev) => ({ ...prev, fetch: true }));
            try {
                const [categoriesResult, servicesResult] = await Promise.all([
                    fetchServiceCategories(),
                    fetchServiceItems(),
                ]);

                if (categoriesResult.success && categoriesResult.categories) {
                    setCategories(categoriesResult.categories);
                }
                if (servicesResult.success && servicesResult.items) {
                    setServices(servicesResult.items);
                }
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch data');
            } finally {
                setIsLoading((prev) => ({ ...prev, fetch: false }));
            }
        };
        loadData();
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

    const validateForm = () => {
        if (!title.trim() || !description.trim() || !category || !imageSrc || !price || discount === '') {
            toast.error('Please fill all required fields');
            return false;
        }

        if (otherInfo.trim()) {
            try {
                JSON.parse(otherInfo);
            } catch (error) {
                console.log(error);
                toast.error('Invalid JSON in Other Info field');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading((prev) => ({ ...prev, create: true }));

        try {
            const lowerCaseTitle = title.toLowerCase();
            const lowerCaseCategory = category.toLowerCase();
            const serviceData = {
                title: lowerCaseTitle,
                description: description,
                category: lowerCaseCategory,
                imageSrc,
                price: parseFloat(price),
                discount: parseFloat(discount),
                ...(otherInfo.trim() && { otherInfo: JSON.parse(otherInfo) }),
            };

            let result: ApiResponse;
            if (editingService) {
                result = await updateServiceItem(editingService.id, serviceData);
                if (result.success) {
                    setServices((prev) =>
                        prev.map((svc) => (svc.id === editingService.id ? { ...svc, ...serviceData } : svc))
                    );
                    toast.success('Service updated successfully');
                    setEditingService(null);
                }
            } else {
                result = await createServiceItem(serviceData);
                if (result.success && result.item) {
                    setServices((prev) => [result.item!, ...prev]);
                    toast.success('Service created successfully');
                }
            }

            resetForm();
        } catch (error) {
            console.log(error);
            toast.error('An error occurred');
        } finally {
            setIsLoading((prev) => ({ ...prev, create: false }));
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('');
        setPrice('');
        setDiscount('');
        setImageSrc('');
        setImagePreview(null);
        setOtherInfo('');
        setEditingService(null);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setTitle(service.title);
        setDescription(service.description);
        setCategory(service.category);
        setPrice(service.price.toString());
        setDiscount(service.discount.toString());
        setImageSrc(service.imageSrc);
        setImagePreview(service.imageSrc);
        setOtherInfo(service.otherInfo ? JSON.stringify(service.otherInfo, null, 2) : '');
    };

    const handleDelete = async (id: string) => {
        setIsLoading((prev) => ({ ...prev, delete: id }));
        try {
            const result = await deleteServiceItem(id);
            if (result.success) {
                setServices(services.filter((svc) => svc.id !== id));
                toast.success('Service deleted successfully');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete service');
        } finally {
            setIsLoading((prev) => ({ ...prev, delete: '' }));
        }
    };

    const filteredServices = services.filter((service) =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedServices = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    return (
        <div className="w-full p-6 space-y-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{editingService ? 'Edit' : 'Create'} Service</CardTitle>
                    <CardDescription>
                        {editingService ? 'Modify' : 'Add'} a service with details and pricing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input placeholder="Service Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.title} value={cat.title}>
                                        {cat.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Textarea
                            placeholder="Service Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="number"
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <Input
                                type="number"
                                placeholder="Discount"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                            />
                        </div>
                        <Textarea
                            placeholder="Other Info (Optional - JSON format)"
                            value={otherInfo}
                            onChange={(e) => setOtherInfo(e.target.value)}
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
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex space-x-2">
                    <Button className="w-full" onClick={handleSubmit} disabled={isLoading.create}>
                        {isLoading.create ? (
                            <Loader2Icon className="mr-2 animate-spin" />
                        ) : editingService ? (
                            'Update Service'
                        ) : (
                            'Create Service'
                        )}
                    </Button>
                    {editingService && (
                        <Button variant="outline" onClick={resetForm}>
                            <XIcon className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Services</CardTitle>
                    <CardDescription>List of all services</CardDescription>
                    <div className="mt-4">
                        <Input
                            placeholder="Search services..."
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
                                        <TableHead className="w-1/6">Title</TableHead>
                                        <TableHead className="w-1/6">Category</TableHead>
                                        <TableHead className="w-1/6">Price</TableHead>
                                        <TableHead className="w-1/6">Discount</TableHead>
                                        <TableHead className="w-1/6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedServices.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell>
                                                <Image
                                                    src={service.imageSrc}
                                                    alt={service.title}
                                                    width={1000}
                                                    height={1000}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            </TableCell>
                                            <TableCell>{service.title}</TableCell>
                                            <TableCell>
                                                {categories.find((cat) => cat.title === service.category)?.title}
                                            </TableCell>
                                            <TableCell>₹{service.price.toFixed(2)}</TableCell>
                                            <TableCell>{service.discount}%</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleEdit(service)}
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            disabled={isLoading.delete === service.id}
                                                        >
                                                            {isLoading.delete === service.id ? (
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
                                                                This will permanently delete the service.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(service.id)}>
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

export default ServiceItemManagement;
