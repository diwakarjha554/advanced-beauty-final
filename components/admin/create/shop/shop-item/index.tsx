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
import { fetchShopCategories, ShopCategory } from '@/actions/admin/shop/shop-category.actions';
import toast from 'react-hot-toast';
import Image from 'next/image';
import {
    createShopItem,
    deleteShopItem,
    fetchShopItems,
    ShopItem,
    updateShopItem,
} from '@/actions/admin/shop/shop-item.actions';

interface Shop {
    id: string;
    imageSrc: string;
    category: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    quantity: number;
    otherInfo?: Record<string, string>;
}

interface ApiResponse {
    success: boolean;
    item?: ShopItem;
    items?: ShopItem[];
    error?: string;
}

const ShopItemManagement = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [otherInfo, setOtherInfo] = useState('');
    const [shopItems, setShopItems] = useState<Shop[]>([]);
    const [categories, setCategories] = useState<ShopCategory[]>([]);
    const [editingShopItem, setEditingShopItem] = useState<Shop | null>(null);
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
                const [categoriesResult, shopItemsResult] = await Promise.all([
                    fetchShopCategories(),
                    fetchShopItems(),
                ]);

                if (categoriesResult.success && categoriesResult.categories) {
                    setCategories(categoriesResult.categories);
                }
                if (shopItemsResult.success && shopItemsResult.items) {
                    setShopItems(shopItemsResult.items);
                }
            } catch (error) {
                console.error(error);
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
            console.error(error);
            toast.error('Image upload failed');
        } finally {
            setIsLoading((prev) => ({ ...prev, upload: false }));
        }
    };

    const validateForm = () => {
        if (!title.trim() || !description.trim() || !category || !imageSrc || !price || discount === '' || !quantity) {
            toast.error('Please fill all required fields');
            return false;
        }

        if (otherInfo.trim()) {
            try {
                JSON.parse(otherInfo);
            } catch (error) {
                console.error(error);
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
            const shopData = {
                title: lowerCaseTitle,
                description,
                category: lowerCaseCategory,
                imageSrc,
                price: parseFloat(price),
                discount: parseFloat(discount),
                quantity: parseInt(quantity),
                ...(otherInfo.trim() && { otherInfo: JSON.parse(otherInfo) }),
            };

            let result: ApiResponse;
            if (editingShopItem) {
                result = await updateShopItem(editingShopItem.id, shopData);
                if (result.success) {
                    setShopItems((prev) =>
                        prev.map((item) => (item.id === editingShopItem.id ? { ...item, ...shopData } : item))
                    );
                    toast.success('Shop item updated successfully');
                    setEditingShopItem(null);
                }
            } else {
                result = await createShopItem(shopData);
                if (result.success && result.item) {
                    setShopItems((prev) => [result.item!, ...prev]);
                    toast.success('Shop item created successfully');
                }
            }

            resetForm();
        } catch (error) {
            console.error(error);
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
        setQuantity('');
        setImageSrc('');
        setImagePreview(null);
        setOtherInfo('');
        setEditingShopItem(null);
    };

    const handleEdit = (item: Shop) => {
        setEditingShopItem(item);
        setTitle(item.title);
        setDescription(item.description);
        setCategory(item.category);
        setPrice(item.price.toString());
        setDiscount(item.discount.toString());
        setQuantity(item.quantity.toString());
        setImageSrc(item.imageSrc);
        setImagePreview(item.imageSrc);
        setOtherInfo(item.otherInfo ? JSON.stringify(item.otherInfo, null, 2) : '');
    };

    const handleDelete = async (id: string) => {
        setIsLoading((prev) => ({ ...prev, delete: id }));
        try {
            const result = await deleteShopItem(id);
            if (result.success) {
                setShopItems(shopItems.filter((item) => item.id !== id));
                toast.success('Shop item deleted successfully');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete shop item');
        } finally {
            setIsLoading((prev) => ({ ...prev, delete: '' }));
        }
    };

    const filteredShopItems = shopItems.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const paginatedShopItems = filteredShopItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredShopItems.length / itemsPerPage);

    return (
        <div className="w-full p-6 space-y-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{editingShopItem ? 'Edit' : 'Create'} Shop Item</CardTitle>
                    <CardDescription>
                        {editingShopItem ? 'Modify' : 'Add'} a shop item with details and pricing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input placeholder="Shop Item Title" value={title} onChange={(e) => setTitle(e.target.value)} />
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
                            placeholder="Shop Item Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="grid grid-cols-3 gap-4">
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
                            <Input
                                type="number"
                                placeholder="Quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
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
                        ) : editingShopItem ? (
                            'Update Shop Item'
                        ) : (
                            'Create Shop Item'
                        )}
                    </Button>
                    {editingShopItem && (
                        <Button variant="outline" onClick={resetForm}>
                            <XIcon className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Shop Items</CardTitle>
                    <CardDescription>List of all shop items</CardDescription>
                    <div className="mt-4">
                        <Input
                            placeholder="Search shop items..."
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
                                        <TableHead className="w-1/6">Quantity</TableHead>
                                        <TableHead className="w-1/6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedShopItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Image
                                                    src={item.imageSrc}
                                                    alt={item.title}
                                                    width={1000}
                                                    height={1000}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            </TableCell>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>
                                                {categories.find((cat) => cat.title === item.category)?.title}
                                            </TableCell>
                                            <TableCell>₹{item.price.toFixed(2)}</TableCell>
                                            <TableCell>{item.discount}%</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                                                        <EditIcon className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                disabled={isLoading.delete === item.id}
                                                            >
                                                                {isLoading.delete === item.id ? (
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
                                                                    This will permanently delete the shop item.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
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

export default ShopItemManagement;
