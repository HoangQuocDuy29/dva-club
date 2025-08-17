import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../auth/enums/auth-status.enum";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { ListNotificationsDto } from "./dto/list-notifications.dto";
import { BulkActionDto } from "./dto/bulk-action.dto";

@ApiTags("Notifications")
@Controller("api/v1/notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // =================== CREATE NOTIFICATION (Admin) ===================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create notification" })
  @ApiResponse({
    status: 201,
    description: "Notification created successfully",
  })
  async create(
    @Body() createDto: CreateNotificationDto,
    @CurrentUser() user: any
  ) {
    const notification = await this.notificationsService.create(
      createDto,
      user.id
    );
    return {
      success: true,
      data: notification,
      message: "Notification created successfully",
    };
  }

  // =================== GET USER NOTIFICATIONS ===================
  @Get("my-notifications")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user notifications" })
  @ApiResponse({
    status: 200,
    description: "Notifications retrieved successfully",
  })
  async getMyNotifications(
    @CurrentUser() user: any,
    @Query() query: ListNotificationsDto
  ) {
    query.recipientId = user.id; // Override để chỉ lấy notification của user hiện tại
    const result = await this.notificationsService.findAll(query);
    return {
      success: true,
      data: result.notifications,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
        unreadCount: result.unreadCount,
      },
    };
  }

  // =================== GET ALL NOTIFICATIONS (Admin) ===================
  @Get("admin/all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all notifications (Admin)" })
  @ApiResponse({
    status: 200,
    description: "All notifications retrieved successfully",
  })
  async findAll(@Query() query: ListNotificationsDto) {
    const result = await this.notificationsService.findAll(query);
    return {
      success: true,
      data: result.notifications,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  // =================== GET NOTIFICATION BY ID ===================
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get notification by ID" })
  @ApiResponse({ status: 200, description: "Notification found" })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any
  ) {
    const notification = await this.notificationsService.findOne(id, user.id);
    return { success: true, data: notification };
  }

  // =================== MARK AS READ ===================
  @Put(":id/mark-read")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark notification as read" })
  @ApiResponse({ status: 200, description: "Notification marked as read" })
  async markAsRead(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any
  ) {
    const notification = await this.notificationsService.markAsRead(
      id,
      user.id
    );
    return {
      success: true,
      data: notification,
      message: "Notification marked as read",
    };
  }

  // =================== MARK AS UNREAD ===================
  @Put(":id/mark-unread")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark notification as unread" })
  @ApiResponse({ status: 200, description: "Notification marked as unread" })
  async markAsUnread(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any
  ) {
    const notification = await this.notificationsService.markAsUnread(
      id,
      user.id
    );
    return {
      success: true,
      data: notification,
      message: "Notification marked as unread",
    };
  }

  // =================== MARK ALL AS READ ===================
  @Put("mark-all-read")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark all notifications as read" })
  @ApiResponse({ status: 200, description: "All notifications marked as read" })
  async markAllAsRead(@CurrentUser() user: any) {
    const count = await this.notificationsService.markAllAsRead(user.id);
    return { success: true, message: `${count} notifications marked as read` };
  }

  // =================== BULK ACTIONS ===================
  @Put("bulk-action")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Perform bulk action on notifications" })
  @ApiResponse({ status: 200, description: "Bulk action completed" })
  async bulkAction(
    @Body() bulkActionDto: BulkActionDto,
    @CurrentUser() user: any
  ) {
    const result = await this.notificationsService.bulkAction(
      bulkActionDto,
      user.id
    );
    return {
      success: true,
      data: result,
      message: `Bulk ${bulkActionDto.action} completed`,
    };
  }

  // =================== GET UNREAD COUNT ===================
  @Get("unread-count")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get unread notifications count" })
  @ApiResponse({
    status: 200,
    description: "Unread count retrieved successfully",
  })
  async getUnreadCount(@CurrentUser() user: any) {
    const count = await this.notificationsService.getUnreadCount(user.id);
    return { success: true, data: { unreadCount: count } };
  }

  // =================== SEND SYSTEM ANNOUNCEMENT ===================
  @Post("system-announcement")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Send system announcement to all users" })
  @ApiResponse({
    status: 201,
    description: "System announcement sent successfully",
  })
  async sendSystemAnnouncement(
    @Body() createDto: CreateNotificationDto,
    @CurrentUser() user: any
  ) {
    const result = await this.notificationsService.sendSystemAnnouncement(
      createDto,
      user.id
    );
    return {
      success: true,
      data: result,
      message: "System announcement sent successfully",
    };
  }

  // =================== UPDATE NOTIFICATION (Admin) ===================
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update notification" })
  @ApiResponse({
    status: 200,
    description: "Notification updated successfully",
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateNotificationDto
  ) {
    const notification = await this.notificationsService.update(id, updateDto);
    return {
      success: true,
      data: notification,
      message: "Notification updated successfully",
    };
  }

  // =================== DELETE NOTIFICATION ===================
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete notification" })
  @ApiResponse({
    status: 200,
    description: "Notification deleted successfully",
  })
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any
  ) {
    await this.notificationsService.remove(id, user.id);
    return { success: true, message: "Notification deleted successfully" };
  }
}
