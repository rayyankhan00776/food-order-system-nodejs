import RestuarantMenu from "../models/restuarant.menu.model.js";


export async function createMenu(req, res) {
    try {
        const data = req.body;

        // Helper validation for single item
        const validateItem = (item) => {
            const { name, description, price, category, cookTime } = item;

            if (!name || !description || !price || !category || !cookTime) {
                return false;
            }
            return true;
        };

        // BULK INSERT
        if (Array.isArray(data)) {
            if (data.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Request body array cannot be empty",
                });
            }

            // Validate all items
            const invalidItem = data.find((item) => !validateItem(item));

            if (invalidItem) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Each item must have name, description, price, category, cookTime",
                });
            }

            const menuItems = await RestuarantMenu.insertMany(data);

            return res.status(201).json({
                success: true,
                message: "Menu items created successfully",
                count: menuItems.length,
                data: menuItems,
            });
        }

        // SINGLE INSERT
        if (!validateItem(data)) {
            return res.status(400).json({
                success: false,
                message:
                    "name, description, price, category, cookTime are required",
            });
        }

        const menuItem = await RestuarantMenu.create(data);

        return res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            data: menuItem,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating menu item",
            error: error.message,
        });
    }
}

// Get All Menu Items
export async function getMenu(req, res) {
    try {
        const menuItems = await RestuarantMenu.find().sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving menu items",
            error: error.message,
        });
    }
}
// get one menu item
export async function getMenuItem(req, res) {
    try {
        const { id } = req.params;
        const menuItem = await RestuarantMenu.findById(id);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: menuItem,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving menu item",
            error: error.message,
        });
    }
}

// Update Menu Item
export async function updateMenu(req, res) {
    try {
        const { id } = req.params;

        const updatedMenu = await RestuarantMenu.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedMenu) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Menu item updated successfully",
            data: updatedMenu,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating menu item",
            error: error.message,
        });
    }
}

// Delete Menu Item
export async function deleteMenu(req, res) {
    try {
        const { id } = req.params;
        const deletedMenu = await RestuarantMenu.findByIdAndDelete(id);
        if (!deletedMenu) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Menu item deleted successfully",
            data: deletedMenu,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting menu item",
            error: error.message,
        });
    }
}

export default {
    createMenu,
    getMenu,
    getMenuItem,
    updateMenu,
    deleteMenu,
};