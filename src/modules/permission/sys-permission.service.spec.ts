import { SysPermissionService } from './sys-permission.service';

describe('SysPermissionService', () => {
  let roleModel: { findAll: jest.Mock };
  let userModel: { findOne: jest.Mock };
  let menuModel: Record<string, never>;
  let service: SysPermissionService;

  beforeEach(() => {
    roleModel = {
      findAll: jest.fn(),
    };
    userModel = {
      findOne: jest.fn(),
    };
    menuModel = {};
    service = new SysPermissionService(
      roleModel as any,
      menuModel as any,
      userModel as any,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getRolePermission', () => {
    it('should query database even if isAdmin is true', async () => {
      userModel.findOne.mockResolvedValue({
        roles: [{ role_key: 'SUPERADMIN' }],
      });
      const roles = await service.getRolePermission({
        user_id: 1,
        isAdmin: true,
      });
      expect(Array.from(roles)).toEqual(['SUPERADMIN']);
      expect(userModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: 1 },
        }),
      );
    });

    it('should query user roles from database', async () => {
      userModel.findOne.mockResolvedValue({
        roles: [{ role_key: 'R1' }, { role_key: 'R2' }],
      });

      const roles = await service.getRolePermission({
        user_id: 1,
        isAdmin: false,
      });
      expect(Array.from(roles).sort()).toEqual(['R1', 'R2']);
      expect(userModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: 1 },
        }),
      );
    });

    it('should return empty set when user has no roles', async () => {
      userModel.findOne.mockResolvedValue({ roles: [] });
      const roles = await service.getRolePermission({
        user_id: 1,
        isAdmin: false,
      });
      expect(Array.from(roles)).toEqual([]);
    });

    it('should return empty set when user query returns null', async () => {
      userModel.findOne.mockResolvedValue(null);
      const roles = await service.getRolePermission({
        user_id: 1,
        isAdmin: false,
      });
      expect(Array.from(roles)).toEqual([]);
    });
  });

  describe('getMenuPermission', () => {
    it('should return wildcard perms when SUPERADMIN role exists', async () => {
      jest
        .spyOn(service, 'getRolePermission')
        .mockResolvedValue(new Set(['SUPERADMIN']));

      const perms = await service.getMenuPermission({ user_id: 1 });
      expect(Array.from(perms)).toEqual(['*:*:*']);
      expect(roleModel.findAll).not.toHaveBeenCalled();
    });

    it('should return empty set when no roles', async () => {
      jest.spyOn(service, 'getRolePermission').mockResolvedValue(new Set());

      const perms = await service.getMenuPermission({ user_id: 1 });
      expect(Array.from(perms)).toEqual([]);
      expect(roleModel.findAll).not.toHaveBeenCalled();
    });

    it('should collect distinct menu perms and ignore empty perms', async () => {
      jest
        .spyOn(service, 'getRolePermission')
        .mockResolvedValue(new Set(['R1', 'R2']));

      roleModel.findAll.mockResolvedValue([
        {
          menus: [{ perms: 'a:b:c' }, { perms: null }, { perms: '' }],
        },
        {
          menus: [{ perms: 'a:b:c' }, { perms: 'x:y:z' }],
        },
      ]);

      const perms = await service.getMenuPermission({ user_id: 1 });
      expect(Array.from(perms).sort()).toEqual(['a:b:c', 'x:y:z']);
      expect(roleModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role_key: ['R1', 'R2'] },
        }),
      );
    });
  });
});
