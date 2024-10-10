import { Component } from '@angular/core';

import {
  TableDataType,
  TableHeader,
} from '@/app/shared/components/data-table/data-table.component';
import { NewsService } from '@/app/shared/services/news.service';
import { UserService } from '@/app/shared/services/user.service';

@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(
    private readonly userService: UserService,
    private readonly newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.getDataSource();
  }

  getDataSource(): void {
    this.newsService.getStandings().subscribe(data => {
      this.dataSourceStandings = { data: data?.standings[0].table ?? [] };
      this.dataSource = data;
    });

    this.newsService.getScorers().subscribe(data => {
      this.dataSourceTopscorer = { data: data?.scorers ?? [] };
    });
  }

  headers: TableHeader[] = [
    {
      label: 'Team',
      key: 'team.name',
      type: TableDataType.render,
      render: data => {
        const imageUrl = data?.['team']['crest']; // Đường dẫn tới hình ảnh của team
        const teamName = data?.['team']['name']; // Tên của team

        return `
          <span>
            <img class="img-thumbnail" style="width: 30px; height: 30px;" src="${imageUrl}"/>
            <span style="margin-left: 5px;">${teamName}</span>
          </span>`;
      },
    },

    {
      label: 'Matches',
      key: 'playedGames',
      type: TableDataType.text,
    },
    {
      label: 'Wins',
      key: 'won',
      type: TableDataType.text,
    },
    {
      label: 'Draws',
      key: 'draw',
      type: TableDataType.text,
    },
    {
      label: 'Losses',
      key: 'lost',
      type: TableDataType.text,
    },
    {
      label: 'Points',
      key: 'points',
      type: TableDataType.text,
    },
    {
      label: '+/-',
      key: 'goalDifference',
      type: TableDataType.text,
    },
  ];

  dataSource?: any;

  dataSourceStandings?: any;

  headersTopscorer: TableHeader[] = [
    {
      label: 'Player Name',
      key: 'player.name',
      type: TableDataType.text,
    },
    {
      label: 'Nationality',
      key: 'player.nationality',
      type: TableDataType.text,
    },
    {
      label: 'Team',
      key: 'team.name',
      type: TableDataType.text,
    },
    {
      label: 'Goals',
      key: 'goals',
      type: TableDataType.text,
    },
    {
      label: 'Assists',
      key: 'assists',
      type: TableDataType.text,
    },
    {
      label: 'Penalties',
      key: 'penalties',
      type: TableDataType.text,
    },
  ];

  dataSourceTopscorer?: any;

  get user() {
    return this.userService.userSimpleProfile;
  }
}
