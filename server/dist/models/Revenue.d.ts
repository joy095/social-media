import mongoose from 'mongoose';
export declare const Revenue: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    city: string;
    pricePerView: number;
    pricePerLike: number;
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    city: string;
    pricePerView: number;
    pricePerLike: number;
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    city: string;
    pricePerView: number;
    pricePerLike: number;
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    city: string;
    pricePerView: number;
    pricePerLike: number;
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    city: string;
    pricePerView: number;
    pricePerLike: number;
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    city: string;
    pricePerView: number;
    pricePerLike: number;
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=Revenue.d.ts.map