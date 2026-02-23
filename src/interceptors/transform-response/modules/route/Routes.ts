import { Expose, Transform, Type, plainToClass } from 'class-transformer';
import { SysMenuInter } from '@/databases/mysql-database/interfaces/sys-menu.interface';

export class Routes {
  @Expose()
  @Transform(({ obj }: { obj: SysMenuInter }) => obj.route_name)
  name: string;

  @Expose()
  path: string;

  @Expose()
  component: string;

  @Expose()
  @Transform(({ obj }: { obj: SysMenuInter }) => ({
    title: obj.menu_name,
    i18nKey: null,
    icon: obj.icon,
    order: obj.order_num,
    hideInMenu: obj.visible === '1',
    constant: Boolean(obj.constant),
  }))
  handle: Record<string, any>;

  @Expose()
  @Type(() => Routes)
  children?: Routes[];
}

export class GeneralRoutes {
  @Expose() home: string;

  @Expose({ name: 'routes' })
  @Transform(({ obj }: { obj: { routes: SysMenuInter[] } }) => {
    console.log('transform routes', obj.routes);
    // return obj.routes;
    return obj.routes.map((item) =>
      plainToClass(Routes, item, {
        excludeExtraneousValues: true,
      }),
    );
  })
  routes: any[];
}
