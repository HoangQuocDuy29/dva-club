import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Notification } from "../../entities/notification.entity";
import { User } from "../../entities/user.entity";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { ListNotificationsDto } from "./dto/list-notifications.dto";
import { BulkActionDto } from "./dto/bulk-action.dto";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  // =================== CREATE NOTIFICATION ===================
  async create(
    createDto: CreateNotificationDto,
    senderId?: number
  ): Promise<Notification> {
    // Validate recipient exists
    const recipient = await this.userRepository.findOne({
      where: { id: createDto.recipientId, isActive: true },
    });
    if (!recipient) {
      throw new NotFoundException(
        `Recipient with ID ${createDto.recipientId} not found`
      );
    }

    // Validate sender if provided
    if (createDto.senderId) {
      const sender = await this.userRepository.findOne({
        where: { id: createDto.senderId, isActive: true },
      });
      if (!sender) {
        throw new NotFoundException(
          `Sender with ID ${createDto.senderId} not found`
        );
      }
    }

    // Create notification
    const notification = this.notificationRepository.create({
      ...createDto,
      senderId: createDto.senderId || senderId,
      priority: createDto.priority || "normal",
      isActive: createDto.isActive !== undefined ? createDto.isActive : true,
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : null,
      isRead: false,
      isSent: false,
    });

    return this.notificationRepository.save(notification);
  }

  // =================== FIND ALL NOTIFICATIONS ===================
  async findAll(query: ListNotificationsDto): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    unreadCount?: number;
  }> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder("notification")
      .leftJoinAndSelect("notification.recipient", "recipient")
      .leftJoinAndSelect("notification.sender", "sender")
      .where("notification.isActive = :isActive", { isActive: true });

    // Filters
    if (query.recipientId) {
      queryBuilder.andWhere("notification.recipientId = :recipientId", {
        recipientId: query.recipientId,
      });
    }

    if (query.notificationType) {
      queryBuilder.andWhere("notification.notificationType = :type", {
        type: query.notificationType,
      });
    }

    if (query.priority) {
      queryBuilder.andWhere("notification.priority = :priority", {
        priority: query.priority,
      });
    }

    if (query.isRead !== undefined) {
      queryBuilder.andWhere("notification.isRead = :isRead", {
        isRead: query.isRead,
      });
    }

    // Exclude expired notifications
    queryBuilder.andWhere(
      "(notification.expiresAt IS NULL OR notification.expiresAt > :now)",
      { now: new Date() }
    );

    // Get unread count if filtering by recipient
    let unreadCount: number | undefined;
    if (query.recipientId) {
      unreadCount = await this.notificationRepository.count({
        where: {
          recipientId: query.recipientId,
          isRead: false,
          isActive: true,
        },
      });
    }

    // Pagination
    const offset = (query.page - 1) * query.limit;
    const [notifications, total] = await queryBuilder
      .orderBy("notification.priority", "DESC")
      .addOrderBy("notification.createdAt", "DESC")
      .skip(offset)
      .take(query.limit)
      .getManyAndCount();

    return {
      notifications,
      total,
      page: query.page,
      limit: query.limit,
      unreadCount,
    };
  }

  // =================== FIND ONE NOTIFICATION ===================
  async findOne(id: number, userId?: number): Promise<Notification> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder("notification")
      .leftJoinAndSelect("notification.recipient", "recipient")
      .leftJoinAndSelect("notification.sender", "sender")
      .where("notification.id = :id", { id })
      .andWhere("notification.isActive = :isActive", { isActive: true });

    // If userId provided, ensure user can only access their own notifications
    if (userId) {
      queryBuilder.andWhere("notification.recipientId = :userId", { userId });
    }

    const notification = await queryBuilder.getOne();

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  // =================== MARK AS READ ===================
  async markAsRead(id: number, userId: number): Promise<Notification> {
    const notification = await this.findOne(id, userId);

    if (!notification.isRead) {
      await this.notificationRepository.update(id, {
        isRead: true,
        readAt: new Date(),
      });
    }

    return this.findOne(id, userId);
  }

  // =================== MARK AS UNREAD ===================
  async markAsUnread(id: number, userId: number): Promise<Notification> {
    const notification = await this.findOne(id, userId);

    if (notification.isRead) {
      await this.notificationRepository.update(id, {
        isRead: false,
        readAt: null,
      });
    }

    return this.findOne(id, userId);
  }

  // =================== MARK ALL AS READ ===================
  async markAllAsRead(userId: number): Promise<number> {
    const result = await this.notificationRepository.update(
      {
        recipientId: userId,
        isRead: false,
        isActive: true,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    return result.affected || 0;
  }

  // =================== BULK ACTIONS ===================
  async bulkAction(bulkActionDto: BulkActionDto, userId: number): Promise<any> {
    const { notificationIds, action } = bulkActionDto;

    // Verify all notifications belong to user
    const userNotifications = await this.notificationRepository.find({
      where: {
        id: In(notificationIds),
        recipientId: userId,
        isActive: true,
      },
    });

    if (userNotifications.length !== notificationIds.length) {
      throw new ForbiddenException(
        "You can only perform actions on your own notifications"
      );
    }

    let result;
    switch (action) {
      case "mark_read":
        result = await this.notificationRepository.update(
          { id: In(notificationIds) },
          { isRead: true, readAt: new Date() }
        );
        break;
      case "mark_unread":
        result = await this.notificationRepository.update(
          { id: In(notificationIds) },
          { isRead: false, readAt: null }
        );
        break;
      case "delete":
        result = await this.notificationRepository.update(
          { id: In(notificationIds) },
          { isActive: false }
        );
        break;
      default:
        throw new BadRequestException("Invalid action");
    }

    return {
      action,
      affectedCount: result.affected || 0,
      processedIds: notificationIds,
    };
  }

  // =================== GET UNREAD COUNT ===================
  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepository.count({
      where: {
        recipientId: userId,
        isRead: false,
        isActive: true,
      },
    });
  }

  // =================== SEND SYSTEM ANNOUNCEMENT ===================
  async sendSystemAnnouncement(
    createDto: CreateNotificationDto,
    senderId: number
  ): Promise<any> {
    // Get all active users
    const users = await this.userRepository.find({
      where: { isActive: true },
      select: ["id", "email", "firstName", "lastName"],
    });

    const notifications: Notification[] = [];

    // Create notification for each user
    for (const user of users) {
      const notification = this.notificationRepository.create({
        recipientId: user.id,
        senderId,
        notificationType: "system_announcement",
        title: createDto.title,
        message: createDto.message,
        actionUrl: createDto.actionUrl,
        metadata: createDto.metadata,
        priority: createDto.priority || "normal",
        expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : null,
        isActive: true,
        isRead: false,
        isSent: false,
      });

      notifications.push(notification);
    }

    // Batch save all notifications
    const savedNotifications = await this.notificationRepository.save(
      notifications
    );

    return {
      totalUsers: users.length,
      notificationsSent: savedNotifications.length,
      message: `System announcement sent to ${users.length} users`,
    };
  }

  // =================== UPDATE NOTIFICATION ===================
  async update(
    id: number,
    updateDto: UpdateNotificationDto
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, isActive: true },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    // Process update data
    const updateData: any = { ...updateDto };
    if (updateDto.expiresAt) {
      updateData.expiresAt = new Date(updateDto.expiresAt);
    }

    await this.notificationRepository.update(id, updateData);
    return this.notificationRepository.findOne({ where: { id } });
  }

  // =================== DELETE NOTIFICATION ===================
  async remove(id: number, userId?: number): Promise<void> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder()
      .where("id = :id", { id })
      .andWhere("isActive = :isActive", { isActive: true });

    // If userId provided, ensure user can only delete their own notifications
    if (userId) {
      queryBuilder.andWhere("recipientId = :userId", { userId });
    }

    const notification = await queryBuilder.getOne();

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    // Soft delete
    await this.notificationRepository.update(id, { isActive: false });
  }

  // =================== HELPER METHODS ===================
  async createTournamentNotification(
    recipientId: number,
    tournamentName: string,
    actionType: string
  ): Promise<Notification> {
    const titles = {
      registration_approved: "Tournament Registration Approved",
      registration_rejected: "Tournament Registration Rejected",
      match_scheduled: "Match Scheduled",
      tournament_started: "Tournament Started",
    };

    const messages = {
      registration_approved: `Your registration for ${tournamentName} has been approved.`,
      registration_rejected: `Your registration for ${tournamentName} has been rejected.`,
      match_scheduled: `A new match has been scheduled for ${tournamentName}.`,
      tournament_started: `${tournamentName} has officially started.`,
    };

    return this.create({
      recipientId,
      notificationType: "tournament_registration",
      title: titles[actionType] || "Tournament Update",
      message: messages[actionType] || `Update regarding ${tournamentName}`,
      entityType: "tournament",
      priority: "normal",
    });
  }
}
