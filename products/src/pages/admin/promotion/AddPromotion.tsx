import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import {
  getAllCategorys,
  type Category,
} from "../../../services/categoryService";
import { toast } from "react-toastify";
import {
  getByIdCategory,
  type Product,
} from "../../../services/productService";
import { PromotionAdd } from "../../../services/promotionService";

interface AddPromotionProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPromotion({
  onClose,
  onSuccess,
}: AddPromotionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categorys, setCategorys] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    categoryID: 0,
    productId: 0,
    quantity: 0,
    discountPercent: 0,
    startDate: "",
    endDate: " ",
  });

  useEffect(() => {
    if (formData.categoryID) {
      (async () => {
        const data = await getByIdCategory(formData.categoryID);
        setProducts(data);
      })();
    }
  }, [formData.categoryID]);

  useEffect(() => {
    getAllCategorys()
      .then((data) => setCategorys(data))
      .catch((error) => console.error("Lỗi khi lấy danh mục:", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { categoryID, ...submitData } = formData;
      await PromotionAdd(submitData);
      toast.success("Thêm sản phẩm thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
    }
  };

  return (
    <Box sx={{ p: 2, position: "relative" }}>
      <Typography variant="h5" align="center">
        Thêm khuyến mãi
      </Typography>
      <IconButton style={{ position: "absolute", top: "0", right: "0" }}>
        <CloseIcon />
      </IconButton>
      <Box height={30}></Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Tên khuyến mãi"
            variant="outlined"
            size="small"
            fullWidth
            name="name"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </Grid>

        <TextField
          label="Hãng xe"
          variant="outlined"
          size="small"
          select
          fullWidth
          name="categoryID"
          value={formData.categoryID}
          onChange={(e) =>
            setFormData({ ...formData, categoryID: Number(e.target.value) })
          }
        >
          {categorys.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Tên xe"
          variant="outlined"
          size="small"
          select
          fullWidth
          name="productId"
          value={formData.productId}
          onChange={(e) =>
            setFormData({ ...formData, productId: Number(e.target.value) })
          }
        >
          {products.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <Grid size={{ xs: 6 }}>
          <TextField
            label="Số lượng"
            variant="outlined"
            size="small"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <TextField
            label="Giá trị khuyến mãi"
            variant="outlined"
            size="small"
            type="number"
            name="discountPercent"
            value={formData.discountPercent}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Ngày bắt đầu"
            variant="outlined"
            size="small"
            type="date" // ✅ Đặt đúng kiểu input
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true, // ✅ Để label không đè lên giá trị ngày
            }}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <TextField
            label="Ngày kết thúc"
            variant="outlined"
            size="small"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
