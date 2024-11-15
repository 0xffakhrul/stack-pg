import { Router } from 'express';
import { createBookmark, getBookmarks, updateBookmark, deleteBookmark } from '../controllers/bookmarkController';
import { authenticateToken } from '../middleware/auth'; 

const router = Router();

//protected with middleware
router.use(authenticateToken);

router.post('/', createBookmark);
router.get('/', getBookmarks);
router.put('/:id', updateBookmark);
router.delete('/:id', deleteBookmark);

export default router; 